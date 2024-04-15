import "./index.css";
import ConversationComponent from './ConversationComponent'
import NavigatorComponent from './NavigatorComponent'
import SettingComponent from './SettingComponent'
import HistoryComponent from './HistoryComponent'
import RandomizeComponent from './RandomizeComponent'
import AccountComponent from './AccountComponent'
import LogoutComponent from './LogoutComponent'
import { useState } from "react";
import Timeline from "./Timeline";
import LandingPage from "./LandingPage";
import DancingBall from './DancingBall'
import Ballon from './Balloon'

function MainFrame() {

    const [content, setContent] = useState("conversation");

    function renderContent() {
        switch (content) {
            case "setting":
                return <Ballon />;
            case "conversation":
                return <ConversationComponent />;
            case "history":
                return <HistoryComponent />;
            case "randomize":
                return <RandomizeComponent />;
            case "account":
                return <AccountComponent />;
            case "logout":
                return <LogoutComponent />;
            default:
                break;
        }
    }

    const handleLinkClick = (content) => {

        setContent(content);
        renderContent();
    };

    return (
        <div className="flex flex-row justify-stretch">
            <NavigatorComponent onLinkClick={handleLinkClick} />
            <div  className='flex w-full'>{renderContent()}</div>
        </div>
    );
}

export default MainFrame;