import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "./axios";

export default function Scan() {
    const webcamRef = React.useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [thanksVisible, setThanksVisible] = useState(false);

    let [email, setEmail] = useState("");

    const capture = React.useCallback(
        e => {
            e.preventDefault();
            const imageSrc = webcamRef.current.getScreenshot();
            // console.log("capture", imageSrc);

            const image = {
                imageSrc: imageSrc
            };
            axios
                .post("/scan", image)
                .then(response => {
                    console.log("email from server", response.data);
                    setModalVisible(true);
                    setEmail(response.data);
                })
                .catch(err => console.log("error on capture upload", err));
        },
        [webcamRef]
    );

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    function handleSend(e) {
        console.log("email", { email });
        e.preventDefault();
        axios
            .post("/send", { email })
            .then(response => {
                console.log("response from server on email send", response);
                setModalVisible(false);
                setThanksVisible(true);
            })
            .catch(err => console.log("error on sending email", err));
    }

    return (
        <div className="webcam">
            <Webcam
                audio={false}
                height={600}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={800}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
            {modalVisible && (
                <div className="modal">
                    <p>Would you like to send a message to {email}?</p>
                    <div className="button-wrapper">
                        <button onClick={handleSend}>Send</button>
                        <button onClick={() => setModalVisible(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {thanksVisible && (
                <div className="modal">
                    <p>Email was sent</p>
                    <div className="button-wrapper">
                        <button onClick={() => setThanksVisible(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
