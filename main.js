var socket = io("https://stcallonline.herokuapp.com/");

$(".divchat").hide();

var openStream = function(){
    var config = {
        audio: true,
        video: true
    }
    return navigator.mediaDevices.getUserMedia(config);
}

var playStream = function(idVideoTag, stream){
    var video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream().then(
//     stream => playStream('localStream', stream)
// );

// var peer = new Peer({ key: 'PeerJS Server', host: 'mypeeronline.herokuapp.com', secure: true, port:443 });
var peer = new Peer({ key: 'lwjd5qra8257b9' });

peer.on('open', function(id) {
    $("#my-peer").append(id);
    $("#btnSignUp").click(function(){
        if($("#txtUserName").val().trim() !== ""){
            socket.emit("signup", {username: $("#txtUserName").val(), peerId: id});
        };
    });
});

// $("#btnCall").click(() => {
//     var remoteId = $("#remoteId").val();
//     openStream().then(
//         stream => {
//             playStream("localStream", stream);
//             var call = peer.call(remoteId, stream);
//             call.on('stream', remoteStream => 
//                 playStream('remoteStream', remoteStream)
//             );
//         }
//     )
// });

//Callee
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


socket.on("list_user_online", (listUser) => {
    $(".divchat").show();
    $(".register").hide();
    listUser.forEach((val) => {
        $("#listUser").append("<li id='"+val.peerId+"'>"+val.username+"</li>")
    });

    socket.on("new_user", (newUser) => {
        $("#listUser").append("<li id='"+newUser.peerId+"'>"+newUser.username+"</li>")
    });

    socket.on("Another_User_Disconnected", (data) => {
        $(`#${data}`).remove();
    });
});

socket.on("signup_unsuccessfully", () => {
    alert("user is existing. Please choice another user!");
});

$("#listUser").on('click', 'li', function() {
    //console.log($(this).attr("id"));
    var remoteId = $(this).attr("id");
    openStream().then(
        stream => {
            playStream("localStream", stream);
            var call = peer.call(remoteId, stream);
            call.on('stream', remoteStream => 
                playStream('remoteStream', remoteStream)
            );
        }
    )
});