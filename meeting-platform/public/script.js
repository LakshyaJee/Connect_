const socket = io();

const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localVideo.srcObject = stream;

    const peerConnection = new RTCPeerConnection();

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit('join-room', 'room1', socket.id, 'User');
      });

    socket.on('user-connected', (userId, userName) => {
      const remoteVideo = document.createElement('video');
      remoteVideos.appendChild(remoteVideo);

      const remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;

      peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit('join-room', 'room1', socket.id, 'User');
        });

      peerConnection.createAnswer()
        .then((answer) => peerConnection.setRemoteDescription(new RTCSessionDescription(answer)));
    });

    socket.on('user-disconnected', (userId, userName) => {
      const remoteVideo = document.querySelector(`#remoteVideos video[data-socket="${userId}"]`);
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.remove();
    });
  })
  .catch((error) => console.error('Error accessing media devices:', error));
