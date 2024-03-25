import "./index.css";
import ChatRoom from './ChatRoom'
import NavigatorComponent from './NavigatorComponent'

function MainFrame() {
    return (
        <div className="flex flex-row justify-stretch">
            <NavigatorComponent />
            <ChatRoom />
        </div>
    );
}

export default MainFrame;