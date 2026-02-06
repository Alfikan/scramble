import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, getRoomResources, deleteResource } from '../services/resourceService';

/**
 * Custom hook for managing room resources
 */
export const useResources = (roomId) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    const result = await getRoomResources(roomId);

    if (result.success) {
      setResources(result.resources);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Upload a file
  const handleUploadFile = useCallback(async (file) => {
    if (!user || !file) return { success: false, error: 'Invalid file' };

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate progress (Firebase doesn't provide real-time progress easily)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    const result = await uploadFile(
      file,
      roomId,
      user.uid,
      user.displayName || 'Anonymous'
    );

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (result.success) {
      await fetchResources(); // Refresh list
    } else {
      setError(result.error);
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 500);

    return result;
  }, [roomId, user, fetchResources]);

  // Delete a resource
  const handleDeleteResource = useCallback(async (resourceId, storagePath) => {
    setError(null);

    const result = await deleteResource(resourceId, storagePath);

    if (result.success) {
      await fetchResources(); // Refresh list
    } else {
      setError(result.error);
    }

    return result;
  }, [fetchResources]);

  return {
    resources,
    loading,
    uploading,
    uploadProgress,
    error,
    uploadFile: handleUploadFile,
    deleteResource: handleDeleteResource,
    refreshResources: fetchResources,
  };
};