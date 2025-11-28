import StartChatButton from "./StartChatButton";
import { getAllStores } from "../../services/api";
import { useEffect, useState } from "react";


const ChatDebugButtons = () => {

    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await getAllStores();
                setStores(data);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };

        fetchStores();
    }, []);
    return (
        <div className="flex gap-2 p-4 border border-gray-300 rounded-md bg-white">
            <h3 className="font-semibold mb-2">Debug Chat Buttons</h3>
            {stores.map((store) => (
                <StartChatButton
                    key={store._id}
                    storeId={store._id}
                    storeName={store.name}
                    variant="flat"
                    size="sm"
                    className=""
                />
            ))}
        </div>
    );
};

export default ChatDebugButtons;