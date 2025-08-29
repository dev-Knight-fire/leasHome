import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import PleaseLogin from '../PleaseLogin/PleaseLogin';
import { Loader, User, Home, Edit, Trash2, Eye, Save, X, Camera, Upload, RotateCcw } from 'lucide-react';
import { db } from '@/Firebase/firestore';
import { storage } from '@/Firebase/storage';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserProfile = () => {
   const { user, loading } = useAuth();
   const [activeTab, setActiveTab] = useState('account');
   const [userData, setUserData] = useState(null);
   const [userProperties, setUserProperties] = useState([]);
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [editForm, setEditForm] = useState({
      name: '',
      email: '',
      phone: '',
      photoURL: ''
   });
   const [photoEditor, setPhotoEditor] = useState({
      isOpen: false,
      selectedFile: null,
      preview: null,
      isUploading: false,
      dragActive: false
   });
   const fileInputRef = useRef(null);
   const dropZoneRef = useRef(null);

   // Fetch user data from Firestore
   const fetchUserData = async () => {
      try {
         if (user?.email) {
            const userDoc = await getDoc(doc(db, 'users', user.email));
            if (userDoc.exists()) {
               const data = userDoc.data();
               setUserData(data);
               setEditForm({
                  name: data.name || '',
                  email: data.email || '',
                  phone: data.phone || '',
                  photoURL: data.photoURL || ''
               });
            }
         }
      } catch (error) {
         console.error('Error fetching user data:', error);
         toast.error('Failed to load user data');
      }
   };

   // Fetch user properties
   const fetchUserProperties = async () => {
      try {
         if (user?.email) {
            const propertiesRef = collection(db, 'properties');
            const q = query(propertiesRef, where('createdBy.email', '==', user.email));
            const querySnapshot = await getDocs(q);
            const properties = querySnapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data()
            }));
            setUserProperties(properties);
         }
      } catch (error) {
         console.error('Error fetching properties:', error);
         toast.error('Failed to load properties');
      }
   };

   useEffect(() => {
      if (user?.email) {
         Promise.all([fetchUserData(), fetchUserProperties()])
            .finally(() => setIsLoading(false));
      }
   }, [user]);

   // Save user data
   const handleSaveUserData = async () => {
      try {
         setIsSaving(true);
         const userRef = doc(db, 'users', user.email);
         await updateDoc(userRef, {
            name: editForm.name,
            phone: editForm.phone,
            photoURL: editForm.photoURL,
            updatedAt: new Date()
         });
         
         setUserData(prev => ({ ...prev, ...editForm }));
         setIsEditing(false);
         toast.success('Profile updated successfully!');
      } catch (error) {
         console.error('Error updating user data:', error);
         toast.error('Failed to update profile');
      } finally {
         setIsSaving(false);
      }
   };

   // Photo Editor Functions
   const handleFileSelect = (file) => {
      if (file && file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onload = (e) => {
            setPhotoEditor(prev => ({
               ...prev,
               selectedFile: file,
               preview: e.target.result
            }));
         };
         reader.readAsDataURL(file);
      } else {
         toast.error('Please select a valid image file');
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      setPhotoEditor(prev => ({ ...prev, dragActive: true }));
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      setPhotoEditor(prev => ({ ...prev, dragActive: false }));
   };

   const handleDrop = (e) => {
      e.preventDefault();
      setPhotoEditor(prev => ({ ...prev, dragActive: false }));
      const files = e.dataTransfer.files;
      if (files.length > 0) {
         handleFileSelect(files[0]);
      }
   };

   const uploadPhoto = async () => {
      if (!photoEditor.selectedFile) {
         toast.error('Please select an image first');
         return;
      }

      try {
         setPhotoEditor(prev => ({ ...prev, isUploading: true }));
         
         // Create a unique filename
         const timestamp = Date.now();
         const fileName = `profile-photos/${user.email}/${timestamp}_${photoEditor.selectedFile.name}`;
         const storageRef = ref(storage, fileName);
         
         // Upload the file
         const snapshot = await uploadBytes(storageRef, photoEditor.selectedFile);
         const downloadURL = await getDownloadURL(snapshot.ref);
         
         // Update user data
         const userRef = doc(db, 'users', user.email);
         await updateDoc(userRef, {
            photoURL: downloadURL,
            updatedAt: new Date()
         });
         
         // Update local state
         setUserData(prev => ({ ...prev, photoURL: downloadURL }));
         setEditForm(prev => ({ ...prev, photoURL: downloadURL }));
         
         // Close editor
         setPhotoEditor({
            isOpen: false,
            selectedFile: null,
            preview: null,
            isUploading: false,
            dragActive: false
         });
         
         toast.success('Profile photo updated successfully!');
      } catch (error) {
         console.error('Error uploading photo:', error);
         toast.error('Failed to upload photo');
      } finally {
         setPhotoEditor(prev => ({ ...prev, isUploading: false }));
      }
   };

   const openPhotoEditor = () => {
      setPhotoEditor(prev => ({ ...prev, isOpen: true }));
   };

   const closePhotoEditor = () => {
      setPhotoEditor({
         isOpen: false,
         selectedFile: null,
         preview: null,
         isUploading: false,
         dragActive: false
      });
   };

   // Delete property
   const handleDeleteProperty = async (propertyId) => {
      if (window.confirm('Are you sure you want to delete this property?')) {
         try {
            await deleteDoc(doc(db, 'properties', propertyId));
            setUserProperties(prev => prev.filter(p => p.id !== propertyId));
            toast.success('Property deleted successfully!');
         } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
         }
      }
   };

   if (!user?.email) {
      return <PleaseLogin />;
   }

   if (loading || isLoading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <Loader className="w-10 h-10 animate-spin" />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
               {/* Sidebar */}
               <div className="lg:w-80">
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                     <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <User className="w-6 h-6 mr-2 text-primary" />
                        My Profile
                     </h2>
                     
                     <nav className="space-y-2">
                        <button
                           onClick={() => setActiveTab('account')}
                           className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                              activeTab === 'account'
                                 ? 'bg-primary text-white shadow-md'
                                 : 'text-gray-600 hover:bg-gray-100'
                           }`}
                        >
                           <User className="w-5 h-5 mr-3" />
                           My Account
                        </button>
                        <button
                           onClick={() => setActiveTab('properties')}
                           className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                              activeTab === 'properties'
                                 ? 'bg-primary text-white shadow-md'
                                 : 'text-gray-600 hover:bg-gray-100'
                           }`}
                        >
                           <Home className="w-5 h-5 mr-3" />
                           My Properties
                        </button>
                     </nav>
                  </div>
               </div>

               {/* Main Content */}
               <div className="flex-1">
                  {activeTab === 'account' && (
                     <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-2xl font-bold text-gray-800">My Account</h3>
                           {!isEditing && (
                              <button
                                 onClick={() => setIsEditing(true)}
                                 className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                              >
                                 <Edit className="w-4 h-4 mr-2" />
                                 Edit Profile
                              </button>
                           )}
                        </div>

                        {isEditing ? (
                           <div className="space-y-6">
                              {/* Profile Photo */}
                              <div className="flex items-center space-x-6">
                                 <div className="relative group">
                                    <img
                                       src={editForm.photoURL || userData?.img || "https://via.placeholder.com/100x100?text=Profile"}
                                       alt="Profile"
                                       className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                    />
                                    <button
                                       onClick={openPhotoEditor}
                                       className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                       <Camera className="w-6 h-6 text-white" />
                                    </button>
                                 </div>
                                 <div className="flex-1 space-y-3">
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Profile Photo
                                       </label>
                                       <div className="flex space-x-2">
                                          <button
                                             onClick={openPhotoEditor}
                                             className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                          >
                                             <Upload className="w-4 h-4 mr-2" />
                                             Upload Photo
                                          </button>
                                          <button
                                             onClick={() => fileInputRef.current?.click()}
                                             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                          >
                                             <Camera className="w-4 h-4 mr-2" />
                                             Choose File
                                          </button>
                                       </div>
                                       <input
                                          ref={fileInputRef}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleFileSelect(e.target.files[0])}
                                          className="hidden"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Or enter photo URL
                                       </label>
                                       <input
                                          type="url"
                                          value={editForm.photoURL}
                                          onChange={(e) => setEditForm(prev => ({ ...prev, photoURL: e.target.value }))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          placeholder="Enter photo URL"
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Name */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                 </label>
                                 <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter your full name"
                                 />
                              </div>

                              {/* Email */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                 </label>
                                 <input
                                    type="email"
                                    value={editForm.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    placeholder="Email (cannot be changed)"
                                 />
                              </div>

                              {/* Phone */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                 </label>
                                 <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter your phone number"
                                 />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex space-x-4 pt-4">
                                 <button
                                    onClick={handleSaveUserData}
                                    disabled={isSaving}
                                    className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                 >
                                    {isSaving ? (
                                       <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                       <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                 </button>
                                 <button
                                    onClick={() => {
                                       setIsEditing(false);
                                       setEditForm({
                                          name: userData?.name || '',
                                          email: userData?.email || '',
                                          phone: userData?.phone || '',
                                          photoURL: userData?.photoURL || ''
                                       });
                                    }}
                                    className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                 >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-6">
                              {/* Profile Photo */}
                              <div className="flex items-center space-x-6">
                                 <img
                                    src={userData?.photoURL || "https://via.placeholder.com/100x100?text=Profile"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                 />
                                 <div>
                                    <h4 className="text-xl font-semibold text-gray-800">{userData?.name || 'No Name'}</h4>
                                    <p className="text-gray-600">{userData?.role || 'User'}</p>
                                 </div>
                              </div>

                              {/* User Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-gray-800">{userData?.email || 'No email'}</p>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                    <p className="text-gray-800">{userData?.phone || 'No phone number'}</p>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                                    <p className="text-gray-800">
                                       {userData?.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                    </p>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                                    <p className="text-gray-800">
                                       {userData?.updatedAt?.toDate?.()?.toLocaleDateString() || 'Never'}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'properties' && (
                     <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-2xl font-bold text-gray-800">My Properties</h3>
                           <Link
                              href="/addproperty"
                              className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                           >
                              <Home className="w-4 h-4 mr-2" />
                              Add Property
                           </Link>
                        </div>

                        {userProperties.length === 0 ? (
                           <div className="text-center py-12">
                              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Properties Yet</h4>
                              <p className="text-gray-500 mb-6">You haven't added any properties yet.</p>
                              <Link
                                 href="/addproperty"
                                 className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                 <Home className="w-4 h-4 mr-2" />
                                 Add Your First Property
                              </Link>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {userProperties.map((property) => (
                                 <div key={property.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="relative mb-4">
                                       <img
                                          src={property.photos?.[0] || "https://via.placeholder.com/300x200?text=Property"}
                                          alt={property.title}
                                          className="w-full h-48 object-cover rounded-lg"
                                       />
                                       <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm font-bold">
                                          ${property.price?.toLocaleString()}
                                       </div>
                                    </div>

                                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                                       {property.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-3">
                                       {property.location}
                                    </p>

                                    <div className="flex items-center justify-between">
                                       <div className="flex space-x-2">
                                          <Link
                                             href={`/singleproperty/${property.id}`}
                                             className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                                          >
                                             <Eye className="w-3 h-3 mr-1" />
                                             View
                                          </Link>
                                          <Link
                                             href={`/addproperty/${property.id}`}
                                             className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                                          >
                                             <Edit className="w-3 h-3 mr-1" />
                                             Edit
                                          </Link>
                                       </div>
                                       <button
                                          onClick={() => handleDeleteProperty(property.id)}
                                          className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                                       >
                                          <Trash2 className="w-3 h-3 mr-1" />
                                          Delete
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Photo Editor Modal */}
         {photoEditor.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Update Profile Photo</h3>
                        <button
                           onClick={closePhotoEditor}
                           className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                           <X className="w-6 h-6" />
                        </button>
                     </div>

                     {/* Drag & Drop Zone */}
                     <div
                        ref={dropZoneRef}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                           photoEditor.dragActive
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                        }`}
                     >
                        {photoEditor.preview ? (
                           <div className="space-y-4">
                              <img
                                 src={photoEditor.preview}
                                 alt="Preview"
                                 className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                              />
                              <p className="text-sm text-gray-600">
                                 {photoEditor.selectedFile?.name}
                              </p>
                              <button
                                 onClick={() => setPhotoEditor(prev => ({ ...prev, selectedFile: null, preview: null }))}
                                 className="flex items-center justify-center mx-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                 <RotateCcw className="w-4 h-4 mr-2" />
                                 Choose Different Photo
                              </button>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                 <p className="text-lg font-medium text-gray-700 mb-2">
                                    Drop your photo here
                                 </p>
                                 <p className="text-sm text-gray-500 mb-4">
                                    or click to browse files
                                 </p>
                                 <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                 >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Choose File
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* File Input */}
                     <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="hidden"
                     />

                     {/* Action Buttons */}
                     <div className="flex space-x-3 mt-6">
                        <button
                           onClick={closePhotoEditor}
                           className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={uploadPhoto}
                           disabled={!photoEditor.selectedFile || photoEditor.isUploading}
                           className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                           {photoEditor.isUploading ? (
                              <>
                                 <Loader className="w-4 h-4 mr-2 animate-spin" />
                                 Uploading...
                              </>
                           ) : (
                              <>
                                 <Save className="w-4 h-4 mr-2" />
                                 Upload Photo
                              </>
                           )}
                        </button>
                     </div>

                     {/* Tips */}
                     <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for best results:</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                           <li>• Use a square image for best results</li>
                           <li>• Recommended size: 400x400 pixels or larger</li>
                           <li>• Supported formats: JPG, PNG, GIF</li>
                           <li>• Maximum file size: 5MB</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default UserProfile;