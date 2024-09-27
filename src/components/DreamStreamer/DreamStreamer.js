// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaSignOutAlt, FaHeart, FaMusic, FaThList, FaSearch } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';

// const DreamStreamer = ({ signOut }) => {
//   const [albums, setAlbums] = useState([]);
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio, setAudio] = useState(null);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [shuffle, setShuffle] = useState(false);
//   const [repeat, setRepeat] = useState(false);
//   const [purchasedAlbums, setPurchasedAlbums] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [genreFilter, setGenreFilter] = useState('');
//   const [yearFilter, setYearFilter] = useState('');
//   const [isBottomPlayerVisible, setIsBottomPlayerVisible] = useState(false); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         const response = await axios.get('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/SongsAlbums');
//         setAlbums(response.data.albums);
//       } catch (error) {
//         console.error('Error fetching albums:', error);
//       }
//     };

//     fetchAlbums();

//     const storedPurchasedAlbums = localStorage.getItem('purchasedAlbums');
//     if (storedPurchasedAlbums) {
//       setPurchasedAlbums(JSON.parse(storedPurchasedAlbums));
//     }
//   }, []);

//   const handlePurchase = (album) => {
//     const isPurchased = purchasedAlbums.some(purchasedAlbum => purchasedAlbum.albumId === album.albumId);

//     if (isPurchased) {
//       alert(`You have already purchased ${album.albumName}!`);
//       return;
//     }

//     alert(`You have purchased ${album.albumName}!`);

//     const newPurchasedAlbums = [...purchasedAlbums, album];
//     setPurchasedAlbums(newPurchasedAlbums);

//     localStorage.setItem('purchasedAlbums', JSON.stringify(newPurchasedAlbums));
//   };

//   const viewPurchasedAlbums = () => {
//     if (purchasedAlbums.length === 0) {
//       alert("You haven't purchased any albums.");
//       navigate('/');
//       return;
//     }

//     setAlbums(purchasedAlbums);
//     setSelectedAlbum(null);
//   };

//   const playTrack = async (trackUrl, index, albumId, trackName) => {
//     if (audio) {
//       audio.pause();
//     }

//     const newAudio = new Audio(trackUrl);
//     newAudio.volume = volume;
//     newAudio.play();
//     setAudio(newAudio);
//     setCurrentTrackIndex(index);
//     setIsPlaying(true);
//     setIsBottomPlayerVisible(true);

//     newAudio.addEventListener('timeupdate', () => {
//       setProgress((newAudio.currentTime / newAudio.duration) * 100);
//     });

//     newAudio.addEventListener('ended', () => {
//       if (repeat) {
//         playTrack(trackUrl, index, albumId, trackName);
//       } else if (shuffle) {
//         playRandomTrack();
//       } else {
//         playNextTrack();
//       }
//     });

//     try {
//       await axios.post('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/TrackingMusic', {
//         albumId,
//         trackName,
//       });
//       console.log('Track play recorded successfully');
//     } catch (error) {
//       console.error('Error recording track play:', error);
//     }
//   };

//   const togglePlayPause = () => {
//     if (audio) {
//       if (isPlaying) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const playNextTrack = () => {
//     if (selectedAlbum) {
//       if (shuffle) {
//         playRandomTrack();
//       } else if (currentTrackIndex < selectedAlbum.tracks.length - 1) {
//         playTrack(selectedAlbum.tracks[currentTrackIndex + 1].trackUrl, currentTrackIndex + 1);
//       } else {
//         setIsPlaying(false);
//       }
//     }
//   };

//   const playPreviousTrack = () => {
//     if (selectedAlbum && currentTrackIndex > 0) {
//       playTrack(selectedAlbum.tracks[currentTrackIndex - 1].trackUrl, currentTrackIndex - 1);
//     }
//   };

//   const playRandomTrack = () => {
//     if (selectedAlbum) {
//       const randomIndex = Math.floor(Math.random() * selectedAlbum.tracks.length);
//       playTrack(selectedAlbum.tracks[randomIndex].trackUrl, randomIndex);
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = e.target.value / 100;
//     setVolume(newVolume);
//     if (audio) {
//       audio.volume = newVolume;
//     }
//   };

//   const handleProgressChange = (e) => {
//     const newProgress = e.target.value;
//     setProgress(newProgress);
//     if (audio) {
//       audio.currentTime = (newProgress / 100) * audio.duration;
//     }
//   };

//   const toggleShuffle = () => {
//     setShuffle(!shuffle);
//   };

//   const toggleRepeat = () => {
//     setRepeat(!repeat);
//   };

//   const handleAlbumClick = (album) => {
//     setSelectedAlbum(album);
//     setCurrentTrackIndex(0);
//     setIsBottomPlayerVisible(true);
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleGenreFilter = (e) => {
//     setGenreFilter(e.target.value);
//   };

//   const handleYearFilter = (e) => {
//     setYearFilter(e.target.value);
//   };

//   const showAllAlbums = () => {
//     setSelectedAlbum(null);
//     setIsBottomPlayerVisible(true);
//   };

//   const filteredAlbums = albums.filter(
//     (album) =>
//       album.albumName.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       (!genreFilter || album.genre === genreFilter) &&
//       (!yearFilter || album.albumYear === yearFilter)
//   );

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (
//     <div className="w-full h-screen flex flex-col">
//       {/* Header */}
//       {/* change bg blue-400 to change the main color */}
//       <header className="flex items-center justify-between p-4 bg-blue-400 text-white">
//         <div className="text-3xl font-bold">DreamStreamer</div>
//         <button
//           onClick={signOut}
//           className="py-2 px-4 bg-transparent text-white rounded-lg hover:bg-red-600 transition duration-200"
//         >
//           <FaSignOutAlt className="text-lg" />
//         </button>
//       </header>

//       {/* Sidebar and Content */}
//       <div className="flex flex-grow">
//         {/* Sidebar */}
//         {/* change bg blue-400 to change the side color */}
//         <aside className="w-1/6 bg-blue-400 p-4 h-full flex-shrink-0">
//           <div className="mb-6">
//             <div className="flex items-center bg-gray-700 p-2 rounded-lg text-white">
//               <FaSearch className="mr-2" />
//               <input
//                 type="text"
//                 className="bg-transparent outline-none w-full text-white"
//                 placeholder="Search"
//                 value={searchQuery}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>
//           <div className="mt-6">
//             <h3 className="font-semibold text-white mb-4">Your Library</h3>
//             <ul className="space-y-4">
//               {/* change hiver:text-blue-900 to change the side bar hover color */}
//               <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition">
//                 <FaHeart className="mr-2" /> Liked Songs
//               </li>
//               <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition">
//                 <FaMusic className="mr-2" /> Custom Songs
//               </li>
//               <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition" onClick={showAllAlbums}>
//                 <FaThList className="mr-2" /> All Albums
//               </li>
//             </ul>
//           </div>
//         </aside>

//         {/* Main Content */}
//         {/* Change bg-gray-900 to change the main content color */}
//         <main className="flex-grow p-6 bg-gray-900">
//           {selectedAlbum ? (
//             <div>
//               <div className="flex items-center space-x-4 mb-6">
//                 <img
//                   src={selectedAlbum.albumArtUrl}
//                   alt="Album Art"
//                   className="w-40 h-40 rounded-lg shadow-lg"
//                 />
//                 <div>
//                   <h2 className="text-4xl font-bold text-white">{selectedAlbum.albumName}</h2>
//                   <p className="text-gray-400">{selectedAlbum.albumYear}</p>
//                   <p className="text-gray-400">{selectedAlbum.artists.join(', ')}</p>
//                   <p className="text-gray-400">{selectedAlbum.tracks.length} songs</p>
//                 </div>
//               </div>
//               <table className="w-full text-white">
//                 <thead>
//                   <tr className="text-gray-500">
//                     <th className="text-left">#</th>
//                     <th className="text-left">Title</th>
                    
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedAlbum.tracks.map((track, index) => (
//                     <tr
//                       key={index}
//                       className={`hover:bg-gray-800 cursor-pointer ${index === currentTrackIndex ? 'bg-gray-800' : ''
//                         }`}
//                       onClick={() => playTrack(track.trackUrl, index, selectedAlbum.albumId, track.trackName)}
//                     >
//                       <td>{index + 1}</td>
//                       <td>{track.trackName}</td>
                     
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <>
//               <h2 className="text-4xl font-bold text-white mb-4">Welcome to DreamStreamer</h2>

//               {/* Filters */}
//               <div className="flex space-x-4 mb-4">
//                 <select
//                   className="bg-gray-800 text-white p-2 rounded-lg"
//                   value={genreFilter}
//                   onChange={handleGenreFilter}
//                 >
//                   <option value="">All Genres</option>
//                   <option value="Rock">Rock</option>
//                   <option value="Pop">Pop</option>
//                   <option value="Hip-hop">Hip-hop</option>
//                 </select>

//                 <select
//                   className="bg-gray-800 text-white p-2 rounded-lg"
//                   value={yearFilter}
//                   onChange={handleYearFilter}
//                 >
//                   <option value="">All Years</option>
//                   <option value="2023">2023</option>
//                   <option value="2022">2022</option>
//                   <option value="2021">2021</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-4 gap-6">
//                 {filteredAlbums.map((album) => (
//                   <div key={album.albumId} className="cursor-pointer">
//                     <img
//                       src={album.albumArtUrl}
//                       alt={album.albumName}
//                       className="w-full h-40 rounded-lg hover:opacity-80 transition duration-200 shadow-lg"
//                       onClick={() => handleAlbumClick(album)}
//                     />
//                     <p className="mt-2 text-center text-lg font-semibold text-white">{album.albumName}</p>
//                     <button
//                       onClick={() => handlePurchase(album)}
//                       className="mt-2 py-1 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full"
//                     >
//                       Purchase
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>
//       </div>

//       {/* Bottom Player */}
//       {isBottomPlayerVisible && (
//         // Change bg-sky-800 to change the bottom player color
//         <footer className="bg-sky-800 p-4 fixed bottom-0 w-full flex items-center justify-between space-y-2">
//           {/* Album art and track info in the left corner */}
//           <div className="flex items-center">
//             <img
//               src={selectedAlbum?.albumArtUrl}
//               alt="Album Art"
//               className="w-12 h-12 rounded-lg mr-4"
//             />
//             <div>
//               <p className="text-sm font-semibold text-white">{selectedAlbum?.tracks[currentTrackIndex]?.trackName}</p>
//               <p className="text-xs text-gray-400">{selectedAlbum?.artists.join(', ')}</p>
//             </div>
//           </div>

//           {/* Play controls in the center */}
//           {/* Change bg-gray-400 to change the play controls color */}
//           <div className="flex flex-col items-center">
//             <div className="flex items-center justify-center space-x-4">
//               <button
//                 className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
//                 onClick={playPreviousTrack}
//               >
//                 <FaStepBackward className="text-white" />
//               </button>
//               <button
//                 className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
//                 onClick={togglePlayPause}
//               >
//                 {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
//               </button>
//               <button
//                 className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
//                 onClick={playNextTrack}
//               >
//                 <FaStepForward className="text-white" />
//               </button>
//             </div>

//             {/* Music Progress Slider */}
//             <div className="flex items-center space-x-2 w-full justify-center mt-2">
//               <span className="text-white text-xs">{formatTime((audio && audio.currentTime) || 0)}</span>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={progress}
//                 onChange={handleProgressChange}
//                 className="w-80"
//               />
//               <span className="text-white text-xs"> / {audio ? formatTime(audio.duration) : '0:00'}</span>
//             </div>
//           </div>

//           {/* Volume control in the right corner */}
//           <div className="flex items-center space-x-2">
//             <FaVolumeUp className="text-white" />
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={volume * 100}
//               onChange={handleVolumeChange}
//               className="w-24"
//             />
//           </div>
//         </footer>
//       )}
//     </div>
//   );
// };

// export default DreamStreamer;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSignOutAlt } from 'react-icons/fa';
// import Sidebar from './Sidebar';  // Import Sidebar component
// import Player from './Player';    // Import Player component
// import { useNavigate } from 'react-router-dom';

// const DreamStreamer = ({ signOut }) => {
//   const [albums, setAlbums] = useState([]);          // State for currently displayed albums
//   const [fullAlbumsList, setFullAlbumsList] = useState([]);  // State to store the full list of albums
//   const [purchasedAlbums, setPurchasedAlbums] = useState([]);  // Purchased albums
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio, setAudio] = useState(null);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [shuffle, setShuffle] = useState(false);  // Shuffle state
//   const [repeat, setRepeat] = useState(false);    // Repeat state
//   const [searchQuery, setSearchQuery] = useState('');
//   const [genreFilter, setGenreFilter] = useState('');
//   const [yearFilter, setYearFilter] = useState('');
//   const [isBottomPlayerVisible, setIsBottomPlayerVisible] = useState(false);
//   const navigate = useNavigate();

//   // Fetch albums on component mount and store both full list and purchased albums
//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         const response = await axios.get('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/SongsAlbums');
//         setAlbums(response.data.albums);         // Display albums in UI
//         setFullAlbumsList(response.data.albums);  // Store full list of albums
//       } catch (error) {
//         console.error('Error fetching albums:', error);
//       }
//     };

//     fetchAlbums();

//     const storedPurchasedAlbums = localStorage.getItem('purchasedAlbums');
//     if (storedPurchasedAlbums) {
//       setPurchasedAlbums(JSON.parse(storedPurchasedAlbums));
//     }
//   }, []);

//   // Function to handle purchasing an album
//   const handlePurchase = (album) => {
//     const isPurchased = purchasedAlbums.some(purchasedAlbum => purchasedAlbum.albumId === album.albumId);

//     if (isPurchased) {
//       alert(`You have already purchased ${album.albumName}!`);
//       return;
//     }

//     alert(`You have purchased ${album.albumName}!`);

//     const newPurchasedAlbums = [...purchasedAlbums, album];
//     setPurchasedAlbums(newPurchasedAlbums);
//     localStorage.setItem('purchasedAlbums', JSON.stringify(newPurchasedAlbums));
//   };

//   // Function to toggle shuffle state
//   const toggleShuffle = () => {
//     setShuffle(!shuffle);
//   };

//   // Function to toggle repeat state
//   const toggleRepeat = () => {
//     setRepeat(!repeat);
//   };

//   // Function to view purchased albums
//   const viewPurchasedAlbums = () => {
//     if (purchasedAlbums.length === 0) {
//       alert("You haven't purchased any albums.");
//       return;
//     }

//     setAlbums(purchasedAlbums);  // Display only purchased albums
//     setSelectedAlbum(null);      // Clear any selected album
//   };

//   // Function to show all albums
//   const showAllAlbums = () => {
//     setAlbums(fullAlbumsList);   // Restore the full album list from state
//     setSelectedAlbum(null);      // Clear any selected album
//   };

//   const playTrack = async (trackUrl, index, albumId, trackName) => {
//     if (audio) {
//       audio.pause();
//     }

//     const newAudio = new Audio(trackUrl);
//     newAudio.volume = volume;
//     newAudio.play();
//     setAudio(newAudio);
//     setCurrentTrackIndex(index);
//     setIsPlaying(true);
//     setIsBottomPlayerVisible(true);

//     newAudio.addEventListener('timeupdate', () => {
//       setProgress((newAudio.currentTime / newAudio.duration) * 100);
//     });

//     newAudio.addEventListener('ended', () => {
//       if (repeat) {
//         playTrack(trackUrl, index, albumId, trackName);
//       } else if (shuffle) {
//         playRandomTrack();
//       } else {
//         playNextTrack();
//       }
//     });

//     try {
//       await axios.post('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/TrackingMusic', {
//         albumId,
//         trackName,
//       });
//       console.log('Track play recorded successfully');
//     } catch (error) {
//       console.error('Error recording track play:', error);
//     }
//   };

//   const togglePlayPause = () => {
//     if (audio) {
//       if (isPlaying) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const playNextTrack = () => {
//     if (selectedAlbum) {
//       if (shuffle) {
//         playRandomTrack();
//       } else if (currentTrackIndex < selectedAlbum.tracks.length - 1) {
//         playTrack(selectedAlbum.tracks[currentTrackIndex + 1].trackUrl, currentTrackIndex + 1);
//       } else {
//         setIsPlaying(false);
//       }
//     }
//   };

//   const playPreviousTrack = () => {
//     if (selectedAlbum && currentTrackIndex > 0) {
//       playTrack(selectedAlbum.tracks[currentTrackIndex - 1].trackUrl, currentTrackIndex - 1);
//     }
//   };

//   const playRandomTrack = () => {
//     if (selectedAlbum) {
//       const randomIndex = Math.floor(Math.random() * selectedAlbum.tracks.length);
//       playTrack(selectedAlbum.tracks[randomIndex].trackUrl, randomIndex);
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = e.target.value / 100;
//     setVolume(newVolume);
//     if (audio) {
//       audio.volume = newVolume;
//     }
//   };

//   const handleProgressChange = (e) => {
//     const newProgress = e.target.value;
//     setProgress(newProgress);
//     if (audio) {
//       audio.currentTime = (newProgress / 100) * audio.duration;
//     }
//   };

//   const handleAlbumClick = (album) => {
//     setSelectedAlbum(album);
//     setCurrentTrackIndex(0);
//     setIsBottomPlayerVisible(true);
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleGenreFilter = (e) => {
//     setGenreFilter(e.target.value);
//   };

//   const handleYearFilter = (e) => {
//     setYearFilter(e.target.value);
//   };

//   const filteredAlbums = albums.filter(
//     (album) =>
//       album.albumName.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       (!genreFilter || album.genre === genreFilter) &&
//       (!yearFilter || album.albumYear === yearFilter)
//   );

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (
//     <div className="w-full h-screen flex flex-col">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 bg-blue-400 text-white">
//         <div className="text-3xl font-bold">DreamStreamer</div>
//         <button
//           onClick={signOut}
//           className="py-2 px-4 bg-transparent text-white rounded-lg hover:bg-red-600 transition duration-200"
//         >
//           <FaSignOutAlt className="text-lg" />
//         </button>
//       </header>

//       {/* Sidebar and Content */}
//       <div className="flex flex-grow">
//         <Sidebar
//           searchQuery={searchQuery}
//           handleSearch={handleSearch}
//           showAllAlbums={showAllAlbums}
//           viewPurchasedAlbums={viewPurchasedAlbums}  // Pass the function to Sidebar
//         />

//         {/* Main Content */}
//         <main className="flex-grow p-6 bg-gray-900">
//           {selectedAlbum ? (
//             <div>
//               <div className="flex items-center space-x-4 mb-6">
//                 <img
//                   src={selectedAlbum.albumArtUrl}
//                   alt="Album Art"
//                   className="w-40 h-40 rounded-lg shadow-lg"
//                 />
//                 <div>
//                   <h2 className="text-4xl font-bold text-white">{selectedAlbum.albumName}</h2>
//                   <p className="text-gray-400">{selectedAlbum.albumYear}</p>
//                   <p className="text-gray-400">{selectedAlbum.artists.join(', ')}</p>
//                   <p className="text-gray-400">{selectedAlbum.tracks.length} songs</p>
//                 </div>
//               </div>
//               <table className="w-full text-white">
//                 <thead>
//                   <tr className="text-gray-500">
//                     <th className="text-left">#</th>
//                     <th className="text-left">Title</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedAlbum.tracks.map((track, index) => (
//                     <tr
//                       key={index}
//                       className={`hover:bg-gray-800 cursor-pointer ${index === currentTrackIndex ? 'bg-gray-800' : ''
//                         }`}
//                       onClick={() => playTrack(track.trackUrl, index, selectedAlbum.albumId, track.trackName)}
//                     >
//                       <td>{index + 1}</td>
//                       <td>{track.trackName}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <>
//               <h2 className="text-4xl font-bold text-white mb-4">Welcome to DreamStreamer</h2>

//               {/* Filters */}
//               <div className="flex space-x-4 mb-4">
//                 <select
//                   className="bg-gray-800 text-white p-2 rounded-lg"
//                   value={genreFilter}
//                   onChange={handleGenreFilter}
//                 >
//                   <option value="">All Genres</option>
//                   <option value="Rock">Rock</option>
//                   <option value="Pop">Pop</option>
//                   <option value="Hip-hop">Hip-hop</option>
//                 </select>

//                 <select
//                   className="bg-gray-800 text-white p-2 rounded-lg"
//                   value={yearFilter}
//                   onChange={handleYearFilter}
//                 >
//                   <option value="">All Years</option>
//                   <option value="2023">2023</option>
//                   <option value="2022">2022</option>
//                   <option value="2021">2021</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-4 gap-6">
//                 {filteredAlbums.map((album) => (
//                   <div key={album.albumId} className="cursor-pointer">
//                     <img
//                       src={album.albumArtUrl}
//                       alt={album.albumName}
//                       className="w-full h-40 rounded-lg hover:opacity-80 transition duration-200 shadow-lg"
//                       onClick={() => handleAlbumClick(album)}
//                     />
//                     <p className="mt-2 text-center text-lg font-semibold text-white">{album.albumName}</p>
//                     <button
//                       onClick={() => handlePurchase(album)}
//                       className="mt-2 py-1 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full"
//                     >
//                       Purchase
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>
//       </div>

//       {/* Bottom Player */}
//       {isBottomPlayerVisible && (
//         <Player
//           selectedAlbum={selectedAlbum}
//           currentTrackIndex={currentTrackIndex}
//           isPlaying={isPlaying}
//           togglePlayPause={togglePlayPause}
//           playPreviousTrack={playPreviousTrack}
//           playNextTrack={playNextTrack}
//           toggleShuffle={toggleShuffle}  
//           toggleRepeat={toggleRepeat}  
//           progress={progress}
//           handleProgressChange={handleProgressChange}
//           volume={volume}
//           handleVolumeChange={handleVolumeChange}
//           formatTime={formatTime}
//           audio={audio}
//           shuffle={shuffle}               
//           repeat={repeat}                
//         />
//       )}
//     </div>
//   );
// };

// export default DreamStreamer;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaSignOutAlt, FaHeart, FaMusic, FaThList, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DreamStreamer = ({ signOut }) => {
  const [albums, setAlbums] = useState([]);
  const [originalAlbums, setOriginalAlbums] = useState([]); // Store original albums
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [purchasedAlbums, setPurchasedAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [isBottomPlayerVisible, setIsBottomPlayerVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for albums
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/SongsAlbums');
        setAlbums(response.data.albums);
        setOriginalAlbums(response.data.albums); // Save original albums
        setLoading(false); // Albums fetched, stop loading
      } catch (error) {
        console.error('Error fetching albums:', error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchAlbums();

    const storedPurchasedAlbums = localStorage.getItem('purchasedAlbums');
    if (storedPurchasedAlbums) {
      setPurchasedAlbums(JSON.parse(storedPurchasedAlbums));
    }
  }, []);

  const handlePurchase = (album) => {
    const isPurchased = purchasedAlbums.some(purchasedAlbum => purchasedAlbum.albumId === album.albumId);

    if (isPurchased) {
      alert(`You have already purchased ${album.albumName}!`);
      return;
    }

    alert(`You have purchased ${album.albumName}!`);

    const newPurchasedAlbums = [...purchasedAlbums, album];
    setPurchasedAlbums(newPurchasedAlbums);

    localStorage.setItem('purchasedAlbums', JSON.stringify(newPurchasedAlbums));
  };

  const viewPurchasedAlbums = () => {
    if (purchasedAlbums.length === 0) {
      alert("You haven't purchased any albums.");
      return;
    }

    setAlbums(purchasedAlbums);
    setSelectedAlbum(null);
  };

  const showAllAlbums = () => {
    setAlbums(originalAlbums); // Reset to original albums
    setSelectedAlbum(null);
  };

  const playTrack = async (trackUrl, index, albumId, trackName) => {
    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(trackUrl);
    newAudio.volume = volume;
    newAudio.play();
    setAudio(newAudio);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setIsBottomPlayerVisible(true);

    newAudio.addEventListener('timeupdate', () => {
      setProgress((newAudio.currentTime / newAudio.duration) * 100);
    });

    newAudio.addEventListener('ended', () => {
      if (repeat) {
        playTrack(trackUrl, index, albumId, trackName);
      } else if (shuffle) {
        playRandomTrack();
      } else {
        playNextTrack();
      }
    });

    try {
      await axios.post('https://c3ewblole2.execute-api.us-east-1.amazonaws.com/DevelopmentStage/TrackingMusic', {
        albumId,
        trackName,
      });
      console.log('Track play recorded successfully');
    } catch (error) {
      console.error('Error recording track play:', error);
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNextTrack = () => {
    if (selectedAlbum) {
      if (shuffle) {
        playRandomTrack();
      } else if (currentTrackIndex < selectedAlbum.tracks.length - 1) {
        playTrack(selectedAlbum.tracks[currentTrackIndex + 1].trackUrl, currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const playPreviousTrack = () => {
    if (selectedAlbum && currentTrackIndex > 0) {
      playTrack(selectedAlbum.tracks[currentTrackIndex - 1].trackUrl, currentTrackIndex - 1);
    }
  };

  const playRandomTrack = () => {
    if (selectedAlbum) {
      const randomIndex = Math.floor(Math.random() * selectedAlbum.tracks.length);
      playTrack(selectedAlbum.tracks[randomIndex].trackUrl, randomIndex);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    if (audio) {
      audio.currentTime = (newProgress / 100) * audio.duration;
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setCurrentTrackIndex(0);
    setIsBottomPlayerVisible(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreFilter = (e) => {
    setGenreFilter(e.target.value);
  };

  const handleYearFilter = (e) => {
    setYearFilter(e.target.value);
  };

  const filteredAlbums = albums.filter(
    (album) =>
      album.albumName && // Ensure albumName exists
      album.albumName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!genreFilter || album.genre === genreFilter) &&
      (!yearFilter || album.albumYear === yearFilter)
  );
  

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-blue-500 text-white">
        <div className="text-3xl font-bold">DreamStreamer</div>
        <div className="flex space-x-4">
          <button
            onClick={viewPurchasedAlbums}
            className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
          >
            View Purchased Albums
          </button>
          <button
            onClick={signOut}
            className="py-2 px-4 bg-transparent text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="ml-2">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-1/6 bg-blue-500 p-4 h-full flex-shrink-0">
          <div className="mb-6">
            <div className="flex items-center bg-gray-700 p-2 rounded-lg text-white">
              <FaSearch className="mr-2" />
              <input
                type="text"
                className="bg-transparent outline-none w-full text-white"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-white mb-4">Your Library</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition">
                <FaHeart className="mr-2" /> Liked Songs
              </li>
              <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition">
                <FaMusic className="mr-2" /> Custom Songs
              </li>
              <li className="flex items-center text-white cursor-pointer hover:text-blue-900 transition" onClick={showAllAlbums}>
                <FaThList className="mr-2" /> All Albums
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-gray-900">
          {loading ? (
            <div className="text-white text-center">
              <p>Loading albums...</p>
              <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mt-4">
                <div className="h-2 bg-blue-500 rounded-full w-1/3 animate-pulse"></div>
              </div>
            </div>
          ) : selectedAlbum ? (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedAlbum.albumArtUrl}
                  alt="Album Art"
                  className="w-40 h-40 rounded-lg shadow-lg"
                />
                <div>
                  <h2 className="text-4xl font-bold text-white">{selectedAlbum.albumName}</h2>
                  <p className="text-gray-400">{selectedAlbum.albumYear}</p>
                  <p className="text-gray-400">{selectedAlbum.artists.join(', ')}</p>
                  <p className="text-gray-400">{selectedAlbum.tracks.length} songs</p>
                </div>
              </div>
              <table className="w-full text-white">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left">#</th>
                    <th className="text-left">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAlbum.tracks.map((track, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-800 cursor-pointer ${index === currentTrackIndex ? 'bg-gray-800' : ''}`}
                      onClick={() => playTrack(track.trackUrl, index, selectedAlbum.albumId, track.trackName)}
                    >
                      <td>{index + 1}</td>
                      <td>{track.trackName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to DreamStreamer</h2>

              {/* Filters */}
              <div className="flex space-x-4 mb-4">
                <select
                  className="bg-gray-800 text-white p-2 rounded-lg"
                  value={genreFilter}
                  onChange={handleGenreFilter}
                >
                  <option value="">All Genres</option>
                  <option value="Rock">Rock</option>
                  <option value="Pop">Pop</option>
                  <option value="Hip-hop">Hip-hop</option>
                </select>

                <select
                  className="bg-gray-800 text-white p-2 rounded-lg"
                  value={yearFilter}
                  onChange={handleYearFilter}
                >
                  <option value="">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {filteredAlbums.map((album) => (
                  <div key={album.albumId} className="cursor-pointer">
                  <img
                    src={album.albumArtUrl || 'default_album_art.jpg'} // Use a default image if albumArtUrl is missing
                    alt={album.albumName || 'Unknown Album'} // Handle missing albumName gracefully
                    className="w-full h-40 rounded-lg hover:opacity-80 transition duration-200 shadow-lg"
                    onClick={() => handleAlbumClick(album)}
                  />
                  <p className="mt-2 text-center text-lg font-semibold text-white">
                    {album.albumName || 'Unknown Album'} {/* Show 'Unknown Album' if albumName is missing */}
                  </p>
                </div>
                
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Bottom Player */}
      {isBottomPlayerVisible && (
        <footer className="bg-sky-800 p-4 fixed bottom-0 w-full flex items-center justify-between space-y-2">
          {/* Album art and track info in the left corner */}
          <div className="flex items-center">
            <img
              src={selectedAlbum?.albumArtUrl}
              alt="Album Art"
              className="w-12 h-12 rounded-lg mr-4"
            />
            <div>
              <p className="text-sm font-semibold text-white">{selectedAlbum?.tracks[currentTrackIndex]?.trackName}</p>
              <p className="text-xs text-gray-400">{selectedAlbum?.artists.join(', ')}</p>
            </div>
          </div>

          {/* Play controls in the center */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center space-x-4">
              <button
                className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={playPreviousTrack}
              >
                <FaStepBackward className="text-white" />
              </button>
              <button
                className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={togglePlayPause}
              >
                {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
              </button>
              <button
                className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={playNextTrack}
              >
                <FaStepForward className="text-white" />
              </button>
            </div>

            {/* Music Progress Slider */}
            <div className="flex items-center space-x-2 w-full justify-center mt-2">
              <span className="text-white text-xs">{formatTime((audio && audio.currentTime) || 0)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-80"
              />
              <span className="text-white text-xs"> / {audio ? formatTime(audio.duration) : '0:00'}</span>
            </div>
          </div>

          {/* Volume control in the right corner */}
          <div className="flex items-center space-x-2">
            <FaVolumeUp className="text-white" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </footer>
      )}
    </div>
  );
};

export default DreamStreamer;
