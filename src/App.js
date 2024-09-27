import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import Home from './pages/Home';
import DreamStreamer from './components/DreamStreamer/DreamStreamer';
import { fetchAuthSession } from '@aws-amplify/auth'; // Import fetchAuthSession
 
// Import the admin components
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import UploadAlbum from './components/Admin/UploadAlbum';
import EditAlbum from './components/Admin/EditAlbum';
 
Amplify.configure(awsExports);
 
function App({ signOut }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false); // New flag to track session check
 
  useEffect(() => {
    if (!isSessionChecked) {
      // Perform session check only if it hasn't been done yet
      fetchAuthSession()
        .then(session => {
          console.log("Session:", session); // Debug: Log the session object
         
          const accessToken = session.tokens?.accessToken?.toString();
          if (!accessToken) {
            console.error("Access Token is missing in the session object");
            return;
          }
 
          const groups = session.tokens.accessToken.payload["cognito:groups"];
          console.log("User Groups:", groups); // Debug: Log the groups
          if (groups && groups.includes('admin')) {
            console.log("User is admin, setting isAdmin to true");
            setIsAdmin(true); // Set isAdmin to true for admins
            navigate('/admin/dashboard', { replace: true }); // Redirect only once if the user is an admin
          } else {
            navigate('/dreamstreamer', { replace: true }); // Redirect for non-admins
          }
 
          setIsSessionChecked(true); // Mark session as checked after first check
        })
        .catch((error) => {
          console.error("Error fetching session:", error);
          navigate('/home', { replace: true });
        });
    }
  }, [isSessionChecked, navigate]); // Only depend on isSessionChecked
 
  return (
    <Routes>
      <Route path="/home" element={<Home signOut={signOut} />} />
      <Route path="/dreamstreamer" element={<DreamStreamer signOut={signOut} />} />
      {/* Admin routes */}
      {isAdmin && (
        <Route path="/admin/*" element={<AdminLayout signOut={signOut} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<UploadAlbum />} /> {/* Accessible to admin */}
          <Route path="edit" element={<EditAlbum />} /> {/* Accessible to admin */}
        </Route>
      )}
    </Routes>
  );
}
 
function AppWithAuth() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <Router>
          <App signOut={signOut} />
        </Router>
      )}
    </Authenticator>
  );
}
 
export default withAuthenticator(AppWithAuth);