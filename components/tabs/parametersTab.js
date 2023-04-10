import Tab from "react-bootstrap/Tab";
import CopyIcon from "../copyIcon";


export default function ParametersTab({ params }) {
    return (
        <Tab.Container defaultActiveKey="first">
            <div className="border rounded p-3 m-3">
                {params && params.arguments
                    ? params.arguments.map((arg, index) => {
                        return (
                            <CopyIcon key={index}>
                                <div>
                                    <i>@param </i>
                                    <code>{arg}</code>
                                    {" - "}
                                    {typeof arg}
                                </div>
                            </CopyIcon>
                        );
                    })
                    : "None"}
            </div>
        </Tab.Container>
    );
}