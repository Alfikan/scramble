import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

/**
 * Resource Service
 * Handles file uploads and resource management
 */

// Upload a file to Firebase Storage
export const uploadFile = async (file, roomId, userId, userName) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `rooms/${roomId}/resources/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save metadata to Firestore
    const resourceData = {
      roomId,
      userId,
      userName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: snapshot.ref.fullPath,
      downloadURL,
      uploadedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'resources'), resourceData);

    return {
      success: true,
      resourceId: docRef.id,
      downloadURL,
      resource: { id: docRef.id, ...resourceData },
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

// Get all resources for a room
export const getRoomResources = async (roomId) => {
  try {
    const q = query(
      collection(db, 'resources'),
      where('roomId', '==', roomId),
      orderBy('uploadedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const resources = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, resources };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { success: false, error: error.message, resources: [] };
  }
};

// Delete a resource
export const deleteResource = async (resourceId, storagePath) => {
  try {
    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, 'resources', resourceId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return { success: false, error: error.message };
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get file icon based on type
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📽️';
  if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
  return '📎';
};