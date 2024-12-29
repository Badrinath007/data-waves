import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Ensure your Supabase instance is correctly initialized
import { debounce } from 'lodash';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch session on initial load and when auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get the current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        setUser(session?.user || null);

        if (session?.user) {
          downloadAvatar(session.user.id); // Load avatar if the user is authenticated
        }
      } catch (error) {
        console.error("Error fetching session:", error.message);
        setUser(null); // Reset user on error
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen to authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Changed:", event, session);
      setUser(session?.user || null); // Update user based on the session
      // Its downloads the avatar more than 100 times.
      //if (session?.user) {
      //  downloadAvatar(session.user.id); // Load avatar after auth state changes
      //}
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe(); // Cleanup listener on component unmount
    };
  }, []);

  // Function to download the avatar
  const downloadAvatar = async (userId) => {
    try {
    
      const { data, error } = supabase
        .storage
        .from('avatars') 
        .getPublicUrl(`${userId}/avatar`);
      if (error) {
        if (error.status === 404) {
          console.warn("Avatar not found, using default placeholder.");
        } else {
          console.error("Error downloading avatar:", error.message);
        }
        setAvatarUrl(null); // Set to null or use a default placeholder
        return;
      }
      setAvatarUrl(`${data.publicUrl}?t=${new Date().getTime()}`); // Set the avatar URL for display
    } catch (error) {
      console.error("Error downloading avatar:", error.message);
    }
  };

  // Function to upload the avatar
  const debouncedUploadAvatar = debounce(async (event) => {
    try {
      setUploading(true);
      setErrorMessage(null);

      const file = event.target.files[0];
      if (!file) return;

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxFileSize = 2 * 1024 * 1024; // 2 MB

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Invalid file format. Only JPEG, PNG, and WEBP are allowed.");
        return;
      }
      if (file.size > maxFileSize) {
        setErrorMessage("File size exceeds 2 MB. Please select a smaller file.");
        return;
      }

      
      const fileName = `${user.id}/avatar`;

      // Add timeout to upload
      //const controller = new AbortController();
      //const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

      const {data, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, file, {
          "upsert": "true"
        });

      //clearTimeout(timeout);

      if (uploadError) throw uploadError;

      console.log("Avatar uploaded successfully!"); 
      downloadAvatar(user.id); // Refresh the avatar after upload
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Upload aborted due to timeout.");
        setErrorMessage("Upload took too long. Please try again.");
      } else {
        console.error("Unexpected error uploading avatar:", error.message);
        setErrorMessage(error.message || "Failed to upload avatar. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  }, 1500); // Debounce interval: 1.5 seconds

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="text-gray-500 mt-2">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-gray-700 opacity-100 animate-fadeIn">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 space-y-6 animate-slideUp">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
      <p className="text-lg text-gray-600">Email: {user.email}</p>

      <div className="relative w-32 h-32 avatar-container">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-2xl">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 cursor-pointer"
        >
          <span className="text-white text-sm">Change</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={debouncedUploadAvatar}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      <button
        onClick={() => navigate('/')}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
      >
        BACK
      </button>
    </div>
  );
};

export default Profile;
