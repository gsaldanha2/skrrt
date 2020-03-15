!function(e){var t={};function s(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,s),a.l=!0,a.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(i,a,function(t){return e[t]}.bind(null,a));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=1)}([function(e,t,s){!function(t){"use strict";function s(){var e;if(!(this instanceof s)){var t=arguments[0],i=arguments[1],a=new s(e=arguments[2]);return a.abbreviate(t,i)}e=arguments[0],this.units=null==e?["k","m","b","t"]:e}s.prototype._abbreviate=function(e,t){t=Math.pow(10,t);for(var s=this.units.length-1;s>=0;s--){var i=Math.pow(10,3*(s+1));if(i<=e){1e3===(e=Math.round(e*t/i)/t)&&s<this.units.length-1&&(e=1,s++),e+=this.units[s];break}}return e},s.prototype.abbreviate=function(e,t){var s=e<0,i=this._abbreviate(Math.abs(e),t||0);return s?"-"+i:i},e.exports?e.exports=s:t.NumberAbbreviate=s}(this)},function(e,t,s){"use strict";s.r(t);class i{constructor(e){this._socket=null,this.alias="",this.start=()=>{this._socket=new WebSocket(e),this._socket.binaryType="arraybuffer"},this.setConnectionCallback=e=>{this._socket.onopen=e},this.setMessageCallback=e=>{this._socket.onmessage=e},this.setDisconnectionCallback=e=>{this._socket.onclose=e},this.send=e=>{this._socket.send(e)},this.close=()=>{this._socket.close()}}get readyState(){return this._socket.readyState}}class a{constructor(){this.entities=new Map,this.player=null,this._inputPacket={laneChange:-1,slow:!1},this._slowButton=$("#slowButton"),this._setupInputForMobile=()=>{$("#body").swipeleft(()=>this._handleKeyPress(37)).swiperight(()=>this._handleKeyPress(39)).swipeup(()=>this._handleKeyPress(38)).swipedown(()=>this._handleKeyPress(40)),this._slowButton.bind("touchstart",()=>this._slowButton.trigger("mousedown")).bind("touchend",()=>this._slowButton.trigger("mouseup")),this._slowButton.mousedown(()=>(this._inputPacket.slow=!0,!1)),$(document).mouseup(()=>(this._inputPacket.slow=!1,!1))},this._setupInput=()=>{window.onkeydown=e=>{let t=e.keyCode?e.keyCode:e.which;this._handleKeyPress(t)},window.onkeyup=e=>{32===(e.keyCode?e.keyCode:e.which)&&(this._inputPacket.slow=!1)}},this._handleKeyPress=e=>{if(null!==this.player)switch(e){case 38:this._inputPacket.laneChange=0;break;case 37:this._inputPacket.laneChange=1;break;case 40:this._inputPacket.laneChange=2;break;case 39:this._inputPacket.laneChange=3;break;case 32:this._inputPacket.slow=!0}},this._packetQueue=[],this._interpData={startUpdate:null,endUpdate:null,renderTime:void 0,clientTime:void 0};let e=Date.now(),t=0;this._preventPacketBackup=()=>{this._interpData.endUpdate=null,this._packetQueue=[]},this._setupStartUpdateVelocities=()=>{this.entities.clear(),this.player=this._interpData.startUpdate.player;for(let e of this._interpData.startUpdate.entities)this.entities.set(e.id,e);for(let e of this._interpData.endUpdate.entities){let t=this.entities.get(e.id);void 0!==t&&(t.dx=e.x-t.x,t.dy=e.y-t.y,t.startx=t.x,t.starty=t.y,t.id===this.player.id&&(t.stats.gasLevelStart=t.stats.gasLevel,t.stats.gasLevelDelta=e.stats.gasLevel-t.stats.gasLevel))}},this._loadStartEndPackets=()=>{if(this._interpData.renderTime=this._interpData.clientTime-100,null!==this._interpData.endUpdate&&this._interpData.renderTime>this._interpData.endUpdate.serverTimeMs&&(this._interpData.startUpdate=this._interpData.endUpdate,this._interpData.endUpdate=null),this._packetQueue.length>0)for(let e=this._packetQueue.length-1;e>=0;e--)if(this._packetQueue[e].serverTimeMs<=this._interpData.renderTime){this._interpData.startUpdate=this._packetQueue[e],this._packetQueue=this._packetQueue.slice(e+1);break}null!==this._interpData.startUpdate&&null===this._interpData.endUpdate&&this._packetQueue.length>0&&(this._packetQueue[0].serverTimeMs>=this._interpData.renderTime?(this._interpData.endUpdate=this._packetQueue.shift(),this._setupStartUpdateVelocities(),this.leaderboard=this._interpData.startUpdate.leaderboard):console.log(this._packetQueue[0].serverTimeMs))},this._interpolate=()=>{this._packetQueue>10&&this._preventPacketBackup();let e=this._interpData.endUpdate.serverTimeMs-this._interpData.startUpdate.serverTimeMs,t=(this._interpData.renderTime-this._interpData.startUpdate.serverTimeMs)/e;for(let e of this.entities.values())isNaN(e.dx)||isNaN(e.dy)||(e.x=e.startx+e.dx*t,e.y=e.starty+e.dy*t,e.id===this.player.id&&(e.stats.gasLevel=e.stats.gasLevelStart+e.stats.gasLevelDelta*t))},this.updateEntities=()=>{let s=Date.now();t=s-e,e=s,void 0!==this._interpData.clientTime&&(this._interpData.clientTime+=t,this._loadStartEndPackets(),null!==this._interpData.startUpdate&&(null===this._interpData.endUpdate||this._interpolate()))},this.cleanup=()=>{},this.handleRecieveSnapshot=e=>{this._packetQueue.push(this._createPacketFromSnapshotBuffer(e.message(new buffers.SnapshotBuffer)))},this._createPacketFromSnapshotBuffer=e=>{let t={entities:[]},s=e.player().id();for(let i=0;i<e.entitiesLength();i++){let a=this._createObjectFromBuffer(e.entities(i));null!==a&&(a.id===s&&(t.player=a),t.entities.push(a))}t.leaderboard=[];for(let s=0;s<e.leaderboardLength();s++)t.leaderboard.push(e.leaderboard(s));return t.player.stats.gasLevel=e.gasLevel(),t.serverTimeMs=e.serverTimeMs().toFloat64(),t.myInfo=e.myInfo(),void 0===this._interpData.clientTime&&(this._interpData.clientTime=t.serverTimeMs),t},this._createObjectFromBuffer=e=>{let t=null;switch(e.entityType()){case buffers.EntityUnion.PlayerBuffer:t=this._createPlayerFromBuffer(e.entity(new buffers.PlayerBuffer));break;case buffers.EntityUnion.GasCanBuffer:t=this._createEntityFromBuffer(e.entity(new buffers.GasCanBuffer),buffers.EntityUnion.GasCanBuffer);break;case buffers.EntityUnion.WreckageBuffer:t=this._createEntityFromBuffer(e.entity(new buffers.WreckageBuffer),buffers.EntityUnion.WreckageBuffer);break;case buffers.EntityUnion.LaunchpadBuffer:t=this._createEntityFromBuffer(e.entity(new buffers.LaunchpadBuffer),buffers.EntityUnion.LaunchpadBuffer)}return t},this._createPlayerFromBuffer=e=>{let t=this._createEntityFromBuffer(e,buffers.EntityUnion.PlayerBuffer);return t.stats={xp:e.stats().xp(),level:e.stats().level(),health:e.stats().health(),hurtFlag:e.stats().hurtFlag(),spawnProtected:e.stats().spawnProtected()},t.name=e.name(),t},this._createEntityFromBuffer=(e,t)=>({x:e.position().x(),y:e.position().y(),rotation:e.position().rotation(),id:e.id(),type:t}),this.serializedInputPacket=()=>{let e=new flatbuffers.Builder(128);buffers.InputPacketBuffer.startInputPacketBuffer(e),buffers.InputPacketBuffer.addLaneChange(e,this._inputPacket.laneChange),buffers.InputPacketBuffer.addSlow(e,this._inputPacket.slow);let t=buffers.InputPacketBuffer.endInputPacketBuffer(e);return buffers.MessageBuffer.startMessageBuffer(e),buffers.MessageBuffer.addMessageType(e,buffers.MessageUnion.InputPacketBuffer),buffers.MessageBuffer.addMessage(e,t),e.finish(buffers.MessageBuffer.endMessageBuffer(e)),e.asUint8Array()},this.resetInputPacket=()=>{this._inputPacket.laneChange=-1},this._setupInput(),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&this._setupInputForMobile()}get myInfo(){return this._interpData.startUpdate.myInfo}}function n(e){return 10*e+20}function r(e){return 200*(Math.pow(2,e)-Math.pow(2,e-1))}var o=s(0),l=s.n(o);const h=new l.a;function c(e,t){return(e%t+t)%t}function f(e){return e*Math.PI/180}function u(e,t){return"rgb("+Math.floor(200*(t-e)/t)+", "+Math.floor(200*e/t)+", 0)"}class d{constructor(e){this._canvas=document.getElementById("canvas"),this._context=this._canvas.getContext("2d"),this._player=void 0,this._imageStorage={playerSpritesheet:document.getElementById("playerSpritesheet"),gascan:document.getElementById("gasCanImg"),wreckage:document.getElementById("wreckageImg"),launchpad:document.getElementById("launchpadImg"),road:document.getElementById("road"),grass:document.getElementById("grass"),intersection:document.getElementById("intersection")},this._leaderboardList={1:$("#1"),2:$("#2"),3:$("#3"),4:$("#4"),5:$("#5"),6:$("#6"),7:$("#7"),8:$("#8"),9:$("#9"),10:$("#10"),11:$("#11")},this._imageForEntity=e=>{switch(e.type){case buffers.EntityUnion.PlayerBuffer:return this._imageStorage.playerSpritesheet;case buffers.EntityUnion.GasCanBuffer:return this._imageStorage.gascan;case buffers.EntityUnion.WreckageBuffer:return this._imageStorage.wreckage;case buffers.EntityUnion.LaunchpadBuffer:return this._imageStorage.launchpad}},this._renderPlayerName=e=>{this._context.font="10px arial",this._context.textAlign="center",this._context.fillStyle="#fff";let t=180===e.rotation||0===e.rotation?34:26;this._context.fillText(e.name,0,t)},this._renderPlayerTail=e=>{let t=this._context.createLinearGradient(0,0,100*Math.cos(f(90)),100*Math.sin(f(90)));e.id===this._player.id?t.addColorStop(0,"rgba(245, 252, 45, 0.6)"):e.stats.level>this._player.stats.level?t.addColorStop(0,"rgba(255, 0, 0, 0.6)"):e.stats.level===this._player.stats.level?t.addColorStop(0,"rgba(0, 0, 255, 0.6)"):t.addColorStop(0,"rgba(0, 255, 0, 0.6)"),t.addColorStop(.8,"transparent"),this._context.lineWidth=24,this._context.beginPath(),this._context.moveTo(0,0),this._context.lineTo(200*Math.cos(f(90)),100*Math.sin(f(90))),this._context.strokeStyle=t,this._context.stroke()},this._renderPlayerExtras=e=>{this._context.fillStyle="rgba(0, 255, 0, 0.3)",e.stats.spawnProtected&&this._context.fillRect(-16,-24,32,48),this._context.fillStyle="rgba(255, 0, 0, 0.3)",e.stats.hurtFlag&&this._context.fillRect(-16,-24,32,48),this._context.rotate(e.rotation*Math.PI/180),e.stats.hurtFlag&&this._renderHPBar(e),this._renderPlayerName(e)},this._renderPlayerOnMinimap=e=>{let t=e.x/7560*150,s=e.y/7560*150;this._context.fillRect(t-3,s-3,6,6)},this._renderMinimap=(e,t)=>{this._context.save(),this._context.translate(8,8),this._context.fillStyle="rgba(0,0,0,0.5)",this._context.fillRect(0,0,150,150),this._context.fillStyle="#555";for(let e=0;e<7;e++)for(let t=0;t<7;t++){let s=150/7*.25;this._context.fillRect(Math.floor(150/7*(e+.5)-s/2),150/7*t,s,150/7+1),this._context.fillRect(150/7*e,Math.floor(150/7*(t+.5)-s/2),150/7+1,s)}this._context.fillStyle="#ef6767";for(let t of e.values())t.type===buffers.EntityUnion.PlayerBuffer&&this._renderPlayerOnMinimap(t);this._context.fillStyle="#4e7ce8",this._renderPlayerOnMinimap(t),this._context.restore()},this._renderEntity=t=>{let s=this._imageForEntity(t);this._context.save(),this._context.translate(Math.round(t.x-e.x),Math.round(t.y-e.y)),this._context.rotate(-t.rotation*Math.PI/180),t.type===buffers.EntityUnion.PlayerBuffer?(this._renderPlayerTail(t),this._context.drawImage(s,32*(t.stats.level-1),0,32,48,-16,-24,32,48),this._renderPlayerExtras(t)):this._context.drawImage(s,-s.width/2,-s.height/2,s.width,s.height),this._context.restore()},this._renderMapChunk=(e,t,s)=>{for(let i=0;i<3;i++)for(let a=0;a<3;a++)this._context.save(),0!==i&&2!==i||0!==a&&2!==a?1===i&&1===a?(this._context.translate(e+360*a+180,t+360*i+180),this._context.rotate(s),this._context.drawImage(this._imageStorage.intersection,-180,-180,361,361)):(this._context.translate(e+360*a+180,t+360*i+180),1===i&&this._context.rotate(90*Math.PI/180),this._context.drawImage(this._imageStorage.road,-180,-180,361,361)):this._context.drawImage(this._imageStorage.grass,e+360*a,t+360*i,361,361),this._context.restore()},this._renderGasLevel=t=>{let s=.5*e.sheight();this._context.fillStyle="rgba(0, 0, 0, 0.3)",this._context.save(),this._context.translate(12,e.sheight()/2),this._context.fillRect(0,-s/2,16,s);let i=Math.max(0,Math.min(t/100,1))*s;this._context.fillStyle=u(t,100),this._context.fillRect(0,s/2-i,16,i),this._setSmallFontProperties(14),this._context.fillStyle="white",this._context.fillText("Gas",8,s/2+12),this._context.restore()},this._renderHPBar=e=>{this._context.fillStyle="rgba(0, 0, 0, 0.3)";let t=180===e.rotation||0===e.rotation?-37:-29;this._context.fillRect(-25,t,50,12),this._context.fillStyle=u(e.stats.health,n(e.stats.level));let s=e.stats.health/n(e.stats.level);s=50*Math.max(0,Math.min(s,1)),this._context.fillRect(-25,t,s,12)},this._drawOffmapTile=(e,t,s)=>{this._renderMapChunk(e,t,s),this._context.fillStyle="rgba(0, 0, 0, 0.5)",this._context.fillRect(e,t,1080,1080)},this._renderLeaderboard=(e,t)=>{for(let e of t)this._leaderboardList[e.rank()].text(e.rank()+": "+e.name()+" - "+h.abbreviate(e.score(),2));this._leaderboardList[11].text(e.rank()+": "+e.name()+" - "+h.abbreviate(e.score(),2))},this._renderMap=t=>{let s=-c(Math.floor(e.x),1080),i=-c(Math.floor(e.y),1080);for(let a=0;a<Math.ceil(e.sheight()/1080)+1;a++)for(let n=0;n<Math.ceil(e.swidth()/1080)+1;n++){let r=s+360*n*3,o=i+360*a*3;r+e.x<-1||o+e.y<-1||r+e.x+e.swidth()/2>7560||o+e.y+e.sheight()/2>7560?this._drawOffmapTile(r,o,-t.rotation*Math.PI/180):this._renderMapChunk(r,o,-t.rotation*Math.PI/180)}},this._setSmallFontProperties=e=>{e||(e=12),this._context.font=e+"px HelveticaNeue-CondensedBold",this._context.textAlign="center",this._context.textBaseline="middle"},this._renderXPBar=t=>{this._context.fillStyle="rgba(0, 0, 0, 0.3)",this._context.fillRect(.1*e.swidth(),e.sheight()-32,.8*e.swidth(),16),this._context.fillStyle="rgb(26, 157, 204)";let s=t.stats.xp/r(t.stats.level);s=Math.max(0,Math.min(s,1))*e.swidth()*.8,this._context.fillRect(.1*e.swidth(),e.sheight()-32,s,16),this._context.fillStyle="white",this._setSmallFontProperties(),this._context.fillText(t.stats.xp+" / "+r(t.stats.level)+" XP",.5*e.swidth(),e.sheight()-32+8)},this._renderLargeHPBar=t=>{this._context.fillStyle="rgba(0, 0, 0, 0.3)",this._context.fillRect(.1*e.swidth(),e.sheight()-52,.8*e.swidth(),16),this._context.fillStyle=u(t.stats.health,n(t.stats.level));let s=t.stats.health/n(t.stats.level);s=Math.max(0,Math.min(s,1))*e.swidth()*.8,this._context.fillRect(.1*e.swidth(),e.sheight()-52,s,16),this._context.fillStyle="white",this._setSmallFontProperties(),this._context.fillText(t.stats.health+" / "+n(t.stats.level)+" HP",.5*e.swidth(),e.sheight()-52+8)},this._renderEntities=e=>{for(let t of e.values())t.type!==buffers.EntityUnion.PlayerBuffer&&this._renderEntity(t);for(let t of e.values())t.type===buffers.EntityUnion.PlayerBuffer&&this._renderEntity(t)},this._renderGasWarning=()=>{this._player.stats.gasLevel<30&&(this._setSmallFontProperties(16),this._context.fillStyle="#cc0000",this._context.fillText("Running low on gas!",e.swidth()/2,e.sheight()/2-60))},this._renderOOBWarning=()=>{(this._player.x>7560||this._player.y>7560||this._player.x<0||this._player.y<0)&&(this._setSmallFontProperties(16),this._context.fillStyle="#cc0000",this._context.fillText("Out of Bounds! Return before you run out of gas!",e.swidth()/2,e.sheight()/2-100))},this.render=(e,t,s,i)=>{this._player=i,this._renderMap(i),this._renderEntities(e),this._renderXPBar(i),this._renderLargeHPBar(i),this._renderLeaderboard(s,t),this._renderMinimap(e,i),this._renderGasLevel(i.stats.gasLevel),this._renderOOBWarning(),this._renderGasWarning()},this.centerCameraOnPlayer=t=>{e.x=t.x-e.swidth()/2,e.y=t.y-e.sheight()/2}}}class _{constructor(e,t,s){this._bufferCanvas=document.getElementById("canvas"),this._bufferCtx=this._bufferCanvas.getContext("2d"),this._duration=t,this._elapsedTime=0,this._tileSize=100,this._tileImage=document.getElementById("tileImg"),this._lastTime=Date.now(),this.reset=e=>{e?(this._reversed=!0,this._elapsedTime=this._duration):(this._reversed=!1,this._elapsedTime=0)},this._updateTime=()=>{let e=Date.now();!1===this._reversed?this._elapsedTime+=e-this._lastTime:this._elapsedTime-=e-this._lastTime,this._lastTime=e},this.update=()=>{if(!this.isFinished()){this._updateTime(),this.isFinished()&&this._callback&&this._callback();for(let t=0;t<Math.floor(e.swidth()/this._tileSize)+1;t++)for(let s=0;s<Math.floor(e.sheight()/this._tileSize)+1;s++)this._bufferCtx.globalAlpha=t%2==0&&s%2==0||t%2==1&&s%2==1?Math.max(Math.min(this._elapsedTime/this._duration,1),0):Math.max(Math.min((this._elapsedTime-this._duration/3)/(this._duration/3),1),0),this._bufferCtx.drawImage(this._tileImage,t*this._tileSize,s*this._tileSize,this._tileSize+1,this._tileSize+1);this._bufferCtx.globalAlpha=1}},this.isFinished=()=>!s&&this._elapsedTime>=this._duration||s&&this._elapsedTime<=0,this.onFinished=e=>{this._callback=e},this.reset(s)}}new l.a;class p{constructor(e){this._bufferCanvas=document.getElementById("canvas"),this._bufferCtx=this._bufferCanvas.getContext("2d"),this._tileImage=document.getElementById("tileImg"),this._tileSize=100,this._playButton=$("#playButton"),this._scoreLabel=$("#scoreLabel"),this._serverSelect=$("#serverSelect"),this._nickInput=$("#nickInput"),this._servers={"North America":"ws://35.239.58.6:8005"},$("#loginArea").slideDown(1e3),$("#infoArea").slideDown(1e3),$("#infoArea2").slideDown(1e3),$("#tutorialArea").slideDown(1e3),$("#leaderboard").slideUp(),$("#slowButton").slideUp(),this._btnClicked=!1,this._showLastScore=()=>{void 0!==e.lastScore&&void 0!==e.lastLevel?(this._scoreLabel.text("You got to Level "+e.lastLevel+" - "+e.lastScore+"XP"),this._scoreLabel.show()):this._scoreLabel.hide()},this._connectToSelected=()=>{e.connect(this._servers[this._serverSelect.val()]),e.connection.alias=this._serverSelect.val(),console.log(this._servers[this._serverSelect.val()])},this._serverSelect.change(this._connectToSelected),$("#refreshBtn").on("click",this._connectToSelected),e.connection||this._connectToSelected(),setTimeout(()=>this._nickInput.focus(),1e3),this._nickInput.on("keypress",e=>{13===e.keyCode&&this._playButton.click()}),this._playButton.click(()=>{!0!==this._btnClicked&&(1===e.connection.readyState?(this._btnClicked=!0,this._nickInput.blur(),ga("send","event","games","play","playing game"),$("#loginArea").slideUp(),$("#infoArea").slideUp(),$("#infoArea2").slideUp(),$("#tutorialArea").slideUp(),$("#leaderboard").slideDown(),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&$("#slowButton").slideDown(),e.animation=new _(e.camera,1e3,!0),e.switchState(new g(e,this._nickInput.val()))):alert("Hmmm... could not connect to server - try a different one."))}),this._handleRecieveMsg=t=>{let s=new Uint8Array(t.data),i=new flatbuffers.ByteBuffer(s),a=buffers.MessageBuffer.getRootAsMessageBuffer(i);if(a.messageType()===buffers.MessageUnion.ServerDataBuffer){a.message(new buffers.ServerDataBuffer);this._serverSelect.find('option[value="'+e.connection.alias+'"]').text(e.connection.alias),void 0!==this._lt&&$("#ping").text("Ping: "+(Date.now()-this._lt))}},this.update=()=>{},this.render=()=>{for(let t=0;t<Math.floor(e.camera.swidth()/this._tileSize)+1;t++)for(let s=0;s<Math.floor(e.camera.sheight()/this._tileSize)+1;s++)this._bufferCtx.drawImage(this._tileImage,t*this._tileSize,s*this._tileSize,this._tileSize+1,this._tileSize+1)},this._hasConnected=()=>{let t=new flatbuffers.Builder(128);buffers.ServerDataBuffer.startServerDataBuffer(t);let s=buffers.ServerDataBuffer.endServerDataBuffer(t);buffers.MessageBuffer.startMessageBuffer(t),buffers.MessageBuffer.addMessageType(t,buffers.MessageUnion.ServerDataBuffer),buffers.MessageBuffer.addMessage(t,s),t.finish(buffers.MessageBuffer.endMessageBuffer(t)),e.connection.send(t.asUint8Array()),this._lt=Date.now()},1===e.connection.readyState?this._hasConnected():e.connection.setConnectionCallback(this._hasConnected),e.connection.setMessageCallback(this._handleRecieveMsg),this._showLastScore()}}class g{constructor(e,t){this.game=new a,this.renderer=new d(e.camera),this._playerName=t,this._createJoinPacket=e=>{let t=new flatbuffers.Builder(128),s=t.createString(e);buffers.JoinDataBuffer.startJoinDataBuffer(t),buffers.JoinDataBuffer.addName(t,s);let i=buffers.JoinDataBuffer.endJoinDataBuffer(t);return buffers.MessageBuffer.startMessageBuffer(t),buffers.MessageBuffer.addMessageType(t,buffers.MessageUnion.JoinDataBuffer),buffers.MessageBuffer.addMessage(t,i),t.finish(buffers.MessageBuffer.endMessageBuffer(t)),t.asUint8Array()},this._rejectConnection=()=>{alert("This server has reached the max limit of players"),this._onDeath()},this._handleRecieveMsg=e=>{let t=new Uint8Array(e.data),s=new flatbuffers.ByteBuffer(t),i=buffers.MessageBuffer.getRootAsMessageBuffer(s);i.messageType()===buffers.MessageUnion.SnapshotBuffer?this.game.handleRecieveSnapshot(i):i.messageType()===buffers.MessageUnion.DeathBuffer?this._onDeath(i.message(new buffers.DeathBuffer)):i.messageType()===buffers.MessageUnion.InfoBuffer&&"reject"===i.message(new buffers.InfoBuffer).msg()&&this._rejectConnection()},this._onDeath=t=>{clearInterval(this._inputIntervalId),this.game.cleanup(),e.lastScore=t.score(),e.lastLevel=t.level(),e.connection.setConnectionCallback(()=>{}),e.connection.setMessageCallback(()=>{}),e.connection.setDisconnectionCallback(()=>{}),e.animation=new _(e.camera,2e3,!1),e.animation.onFinished(()=>e.switchState(new p(e)))},this._setup=()=>{e.connection.send(this._createJoinPacket(this._playerName)),this._inputIntervalId=setInterval(()=>{e.connection.send(this.game.serializedInputPacket()),this.game.resetInputPacket()},50),e.connection.setDisconnectionCallback(()=>alert("Uh oh! Disconnected from Server!")),e.connection.setMessageCallback(this._handleRecieveMsg)},this.update=()=>{this.game.updateEntities()},this.render=()=>{null!==this.game.player&&(this.renderer.centerCameraOnPlayer(this.game.player),this.renderer.render(this.game.entities,this.game.leaderboard,this.game.myInfo,this.game.player))},this._setup()}}window.onload=function(){console.log("------------ WELCOME TO SKRRT.IO ------------");let e=document.getElementById("canvas"),t=e.getContext("2d"),s=1,a=document.getElementById("menuWrapper"),n={state:null,animation:null,connection:null};function r(){e.width=window.innerWidth*window.devicePixelRatio,e.height=window.innerHeight*window.devicePixelRatio,t.imageSmoothingEnabled=!1,n.camera.scale=Math.max(window.innerWidth*window.devicePixelRatio/1680,window.innerHeight*window.devicePixelRatio/945),t.setTransform(n.camera.scale,0,0,n.camera.scale,0,0),s=Math.min(window.innerWidth/940,window.innerHeight/782),function(e,t){let s=`translate(-50%, -0%) scale(${t})`;e.style.transform=s,e.style["-o-transform"]=s,e.style["-webkit-transform"]=s,e.style["-moz-transform"]=s,e.style["-ms-transform"]=s}(a,s)}n.camera={x:0,y:0},n.camera.swidth=()=>Math.floor(e.width/n.camera.scale),n.camera.sheight=()=>Math.floor(e.height/n.camera.scale),n.connect=e=>{n.connection&&n.connection.close(),n.connection=new i(e),n.connection.start()},n.switchState=e=>{n.state=e,r()},n.animation=new _(n.camera,1e3,!1),n.animation.onFinished(()=>n.state=new p(n)),window.requestAnimationFrame((function e(){n.state&&n.state.update(),t.fillStyle="black",t.fillRect(0,0,n.camera.swidth(),n.camera.sheight()),n.state&&n.state.render(),n.animation&&(n.animation.update(),n.animation.isFinished()&&(n.animation=null)),window.requestAnimationFrame(e)})),r(),window.onresize=r,window.addEventListener("orientationchange",r)}}]);