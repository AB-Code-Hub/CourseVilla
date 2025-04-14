import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ArrowDownCircleIcon,
  PrinterIcon,
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserDetails } from '../../service/UserService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateGenerator = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState(null);
  const [certificateData, setCertificateData] = useState({
    title: 'Certificate of Achievement',
    description: 'This certificate is proudly presented to [Name] for successfully completing the course requirements.',
    date: new Date().toISOString().split('T')[0],
    courseName: 'Advanced React Development',
    instructor: 'Bilal Chaudhary',
    signature: '',
    template: 'default'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails(userId);
        const user = userData?.data?.data;
        setUser(user);
        
        // Set default certificate data with user info
        setCertificateData(prev => ({
          ...prev,
          description: prev.description.replace('[Name]', `${user.firstName} ${user.lastName}`)
        }));
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load user data', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
          }
        });
        navigate('/admin/users');
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1, // Reduced scale for better performance
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      pdf.save(`certificate_${user.firstName}_${user.lastName}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!certificateRef.current) return;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
      const printWindow = window.open('', '', 'width=1000,height=800');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              body {
                margin: 0;
                padding: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #ffffff;
              }
              img {
                max-width: 100%;
                height: auto;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              @media print {
                body { 
                  padding: 0;
                  background: none;
                }
                img {
                  width: 100%;
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <img 
              src="${dataUrl}" 
              onload="setTimeout(function() { window.print(); window.close(); }, 500)"
            />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to prepare for printing. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !user) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <AnimatePresence>
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Users
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:flex sm:items-center mb-8">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Certificate Generator
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Creating certificate for {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <XMarkIcon className="-ml-1 mr-2 h-5 w-5" />
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                    Save Changes
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Certificate
                </motion.button>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Certificate Editor */}
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1 bg-white shadow rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Certificate Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={certificateData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-slate-700 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="courseName"
                      name="courseName"
                      value={certificateData.courseName}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={certificateData?.description}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={certificateData.date}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-slate-700 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={certificateData.instructor}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Certificate Preview */}
            <motion.div 
              variants={itemVariants}
              className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}
            >
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Certificate Preview
                  </h2>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={handleDownloadPDF}
                      disabled={generating}
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowDownCircleIcon className="h-4 w-4 mr-1" />
                      PDF
                    </motion.button>
                    <motion.button
                      onClick={handlePrint}
                      disabled={generating}
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PrinterIcon className="h-4 w-4 mr-1" />
                      Print
                    </motion.button>
                  </div>
                </div>

                {/* Certificate Template */}
                <div 
                  ref={certificateRef}
                  className="w-full aspect-[1.414/1] p-8 flex flex-col items-center justify-center relative"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '2px solid #e5e7eb'
                  }}
                >
                  {/* Certificate Border */}
                  <div 
                    className="absolute"
                    style={{
                      inset: '1rem',
                      border: '2px solid #1f2937',
                      borderRadius: '0.5rem'
                    }}
                  ></div>
                  
                  {/* Certificate Header */}
                  <div className="text-center mb-8">
                    <h2 style={{ color: '#1f2937', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {certificateData.title}
                    </h2>
                    <div style={{ width: '6rem', height: '0.25rem', backgroundColor: '#1f2937', margin: '0 auto' }}></div>
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center mb-8 flex-1 flex flex-col justify-center">
                    <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                      This certifies that
                    </p>
                    <h3 style={{ color: '#1f2937', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                      {user.firstName} {user.lastName}
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                      {certificateData.description}
                    </p>
                    <p style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                      {certificateData.courseName}
                    </p>
                  </div>

                  {/* Certificate Footer */}
                  <div className="w-full flex justify-between mt-8">
                    <div className="text-center">
                      <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Date</p>
                      <p style={{ color: '#1f2937', fontWeight: '500' }}>{formatDate(certificateData.date)}</p>
                    </div>
                    <div className="text-center">
                      <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Instructor</p>
                      <p style={{ color: '#1f2937', fontWeight: '500' }}>{certificateData.instructor}</p>
                    </div>
                  </div>

                  {/* Certificate Seal */}
                  <div 
                    className="absolute flex items-center justify-center"
                    style={{
                      bottom: '2rem',
                      right: '2rem',
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '9999px',
                      border: '2px solid #1f2937'
                    }}
                  >
                    <CheckIcon style={{ width: '2rem', height: '2rem', color: '#1f2937' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CertificateGenerator;