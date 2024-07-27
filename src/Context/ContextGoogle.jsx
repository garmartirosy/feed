import { createContext, useState, useEffect} from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import Papa from 'papaparse';  

const Context = createContext();

export default function ContextProvider({ children }) {
    const [mediaList, setMediaList] = useState([]);
    const [currentMedia, setCurrentMedia] = useState(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                // Pulls from this Google Sheet: https://docs.google.com/spreadsheets/d/1jQTlXWom-pXvyP9zuTcbdluyvpb43hu2h7anxhF5qlQ/edit?usp=sharing
                // Add comments in the sheet above to request additions.
                const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSxfv7lxikjrmro3EJYGE_134vm5HdDszZKt4uKswHhsNJ_-afSaG9RoA4oeNV656r4mTuG3wTu38pM/pub?output=csv');
                Papa.parse(response.data, {
                    header: true,  // Assuming your CSV has headers
                    complete: (results) => {
                        const media = results.data.map(row => ({
                            url: row.URL,
                            title: row.Title,
                            text: row.Text
                        }));
                        console.log('Fetched media:', media);  // Log the fetched media
                        setMediaList(media);
                        if (media.length > 0) {
                            setCurrentMedia(media[0]); // Set the first media item as the current media
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching media:', error);
            }
        };

        fetchMedia();
    }, []);
   
    return (
        <Context.Provider value={{ mediaList, setMediaList, currentMedia, setCurrentMedia }}>
            {children}
        </Context.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { Context }