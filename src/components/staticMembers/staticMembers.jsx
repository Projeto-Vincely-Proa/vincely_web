import "./staticMembers.css";
import ContainerMembros from "../communitymembers/communitymembers.jsx";
import EstaticContainer from "../statpanel/statpanel.jsx";

function staticMembers() {
    return (
        <div className="stats-panel">
            <ContainerMembros />
            <EstaticContainer />
        </div>
    );
}

export default staticMembers;
