(()=>{var r=Tiles={BLUE:0,CYAN:1,ORANGE:2,YELLOW:3,GREEN:4,RED:5,PURPLE:6,BOARD:7,BORDER_BOTTOM:8,BORDER_LEFT:9,BORDER_TOP:10,BORDER_RIGHT:11,GHOST:12,HELPER:13,EMPTY:14,EMPTY2:15,BORDER_CORNER_BOTTOM_LEFT:16,BORDER_CORNER_TOP_LEFT:17,BORDER_CORNER_TOP_RIGHT:18,BORDER_CORNER_BOTTOM_RIGHT:19};cos=Math.cos(Math.PI/2);sin=Math.sin(Math.PI/2);RotationMatrix=[cos,sin,-sin,cos];TetrominoBag=[];var O={L:"L",I:"I",J:"J",O:"O",S:"S",T:"T",Z:"Z"},v=()=>{if(TetrominoBag.length===0){let e=Object.keys(O);for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}TetrominoBag=[...e]}let c=TetrominoBag.pop();return DEBUG&&console.log("Tetromino bag: ",TetrominoBag),c},B={L:r.ORANGE,I:r.CYAN,J:r.BLUE,O:r.YELLOW,S:r.GREEN,T:r.PURPLE,Z:r.RED},p={I:[[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],[[0,0],[-1,0],[2,0],[-1,2],[2,-1]],[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],[[0,0],[-1,0],[2,0],[-1,2],[2,-1]]],JLOSTZ:[[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],[[0,0],[1,0],[1,-1],[0,2],[1,2]],[[0,0],[1,0],[1,-1],[0,2],[1,2]],[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],[[0,0],[1,0],[1,1],[0,-2],[1,-2]],[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],[[0,0],[1,0],[1,1],[0,-2],[1,-2]]]};var m={I:[0,0],O:[0,0],J:[-.5,.5],L:[-.5,.5],S:[-.5,.5],T:[-.5,.5],Z:[-.5,.5]},u={L:{cells:[[1,1],[-1,0],[0,0],[1,0]],wallKicks:p.JLOSTZ},I:{cells:[[-1,1],[0,1],[1,1],[2,1]],wallKicks:p.I},J:{cells:[[-1,1],[-1,0],[0,0],[1,0]],wallKicks:p.JLOSTZ},O:{cells:[[0,0],[1,0],[0,1],[1,1]],wallKicks:p.JLOSTZ},S:{cells:[[-1,0],[0,0],[0,1],[1,1]],wallKicks:p.JLOSTZ},T:{cells:[[-1,0],[0,0],[1,0],[0,1]],wallKicks:p.JLOSTZ},Z:{cells:[[-1,1],[0,1],[0,0],[1,0]],wallKicks:p.JLOSTZ}};function P(c){return JSON.parse(JSON.stringify(c))}function I(c,e,t,s){let o=v(),a=u[o],l=c.add.container(e,t-(o===u.I?1:0)).setScale(s);return l.setData("cells",P(a.cells)),l.setData("wallKicks",a.wallKicks),l.setData("tile",B[o]),l.setData("type",o),l.setData("rotationIndex",0),l.setData("rotation",[0,0]),l.setData("x",e),l.setData("y",t-(o===u.I?1:0)),DEBUG&&console.log("Spawned tetromino: ",l),l}function x(c,e,t){let s=e.getData("type"),o=u[s],a=c.add.container(0,0).setScale(t);return a.setData("tile",r.GHOST),a.setData("cells",P(e.getData("cells"))),a.setData("type",e.getData("type")),a.setData("rotationIndex",e.getData("rotationIndex")),a.setData("rotation",e.getData("rotation")),a.setData("x",e.getData("x")),a.setData("y",e.getData("y")),a.setData("wallKicks",e.getData("wallKicks")),a}function R(c,e,t){return c<e?t-(e-c)%(t-e):e+(c-e)%(t-e)}function w(c,e,t,s,o){originalRotation=s.getData("rotationIndex")||0,rotationIndex=R(originalRotation+o,0,4),DEBUG&&console.log("Rotation: ",rotationIndex),k(s,o),S(c,e,t,s,rotationIndex,o)||(rotationIndex=originalRotation,k(s,-o)),s.setData("rotationIndex",rotationIndex)}function S(c,e,t,s,o,a){for(wallKicks=s.getData("wallKicks"),wallKickIndex=G(o,a),DEBUG&&console.log("Wall kicks being evaluated: ",wallKicks[wallKickIndex]),i=0;i<5;i++)if(translation=wallKicks[wallKickIndex][i],T(c,e,t,s,translation,!0))return DEBUG&&console.log("Wall kick success"),!0;return DEBUG&&console.log("Wall kick failure"),!1}function G(c,e){return wallKickIndex=c*2,e<0&&wallKickIndex--,R(wallKickIndex,0,8)}function A(c,e,t,s,o,a){let l=s.getData("cells"),h=s.getData("type"),g=s.getData("x"),n=s.getData("y");DEBUG&&(c.clear(),console.log("Testing move: ",o));for(let D=0;D<l.length;D++){let d=g+l[D][0]+o[0],f=n+l[D][1]-o[1];if(DEBUG&&(wx=e.tileToWorldX(d),wy=e.tileToWorldY(20-f),c.lineStyle(1,16711935),c.strokeRectShape(new Phaser.Geom.Rectangle(wx,wy,64*t,64*t))),d%1!==0||f%1!==0)return DEBUG&&console.log("Bug: ",d,f),!1;let y=e.getTileAt(d,20-f);if(!y||y.index!==r.BOARD)return DEBUG&&console.log("Tile occupied"),!1}return!0}function T(c,e,t,s,o,a){return isValid=A(c,e,t,s,o,a),isValid&&(s.setData("x",s.getData("x")+o[0]),s.setData("y",s.getData("y")-o[1]),s.x=e.tileToWorldX(s.getData("x")),s.y=e.tileToWorldY(19-s.getData("y"))),isValid}function k(c,e){let t=m[c.getData("type")],s=c.getData("cells"),o=c.getData("type"),a=RotationMatrix,l=[],h=o===O.O||o===O.I;if(h)for(let g=0;g<s.length;g++)s[g][0]-=.5,s[g][1]-=.5;for(let g=0;g<s.length;g++){let n=parseFloat((s[g][0]*a[0]*e+s[g][1]*a[1]*e).toFixed(1)),D=parseFloat((s[g][0]*a[2]*e+s[g][1]*a[3]*e).toFixed(1));l.push([h?Math.ceil(n):Math.round(n),h?Math.ceil(D):Math.round(D)])}return c.setData("cells",l),tmp=[parseFloat((t[0]*a[0]*e+t[1]*a[1]*e).toFixed(1)),parseFloat((t[0]*a[2]*e+t[1]*a[3]*e).toFixed(1))],c.setData("rotation",tmp),l}WIDTH=640;HEIGHT=1024;DEBUG=!1;BOARD_WIDTH=10;BOARD_HEIGHT=20;BLOCK_SIZE=64;isClicking=!1;swipeDirection="";touchDeltaX=0;touchDeltaY=0;swipeDelay=0;dropped=!1;clicked=!1;dragged=!1;var E=class extends Phaser.Scene{constructor(){super({key:"Jetris",active:!0}),this.container,this.level,this.center={x:WIDTH/2,y:HEIGHT/2},this.deltaX=this.center.x*2/8,this.deltaY=this.center.y*2/20,this.gameScale=this.deltaX*2.5/this.center.x,this.gameScaleY=this.deltaY*2.5/this.center.y,this.adjustedBlockSize=BLOCK_SIZE*this.gameScale,this.elapsed=0,this.activePiece,this.ghostPiece,this.graphics,this.gameOver=!1}preload(){this.load.image("block",["assets/Sprites/tetris.png","assets/Sprites/tetris_n.png"]),this.load.spritesheet("fullscreen","assets/ui/fullscreen.png",{frameWidth:BLOCK_SIZE,frameHeight:BLOCK_SIZE})}createTileMap(){this.lights.enable().setAmbientColor(14540253);let e=this.lights.addLight(WIDTH,-HEIGHT,HEIGHT*3,16777215,4);this.level=Array.from({length:BOARD_HEIGHT},()=>Array.from({length:BOARD_WIDTH},()=>r.BOARD)),this.map=this.make.tilemap({data:this.level,tileWidth:BLOCK_SIZE,tileHeight:BLOCK_SIZE});let t=this.map.addTilesetImage("tiles","block",BLOCK_SIZE,BLOCK_SIZE,0,0,0);this.map.createLayer(0,t,this.center.x-BOARD_WIDTH/2*BLOCK_SIZE*this.gameScale,BLOCK_SIZE*this.gameScale).setScale(this.gameScale).setPipeline("Light2D")}checkFractions(e,t){return e%1!==0||t%1!==0?(DEBUG&&console.log("bug: ",e,t),!0):!1}setTile(e,t,s){this.checkFractions(e,t)||this.map.putTileAt(s,e,BOARD_HEIGHT-t)}getTile(e,t){return this.checkFractions(e,t)?null:this.map.getTileAt(e,BOARD_HEIGHT-t)}setTetromino(e){let t=e.getData("cells"),s=e.getData("x"),o=e.getData("y");if(this.checkFractions(s,o)){DEBUG&&console.log("SetTetromino: ",e);return}for(let a=0;a<t.length;a++)for(let l=0;l<t[a].length-1;l++){if(this.checkFractions(t[a][l],t[a][l+1])){DEBUG&&console.log("Move Data!!",tetrommino);return}let h=this.getTile(s+t[a][l],o+t[a][l+1]);if(h&&h.index===r.BOARD)this.setTile(s+t[a][l],o+t[a][l+1],e.getData("tile"));else{this.gameOver=!0;return}}}clearTetromino(e){let t=e.getData("cells"),s=e.getData("x"),o=e.getData("y");if(!this.checkFractions(s,o))for(let a=0;a<t.length;a++)for(let l=0;l<t[a].length-1;l++){if(this.checkFractions(t[a][l],t[a][l+1]))return;this.setTile(s+t[a][l],o+t[a][l+1],7)}}addFullScreenToggle(){let e=this.add.image(WIDTH-16,16,"fullscreen",0).setOrigin(1,0).setScale(.25).setInteractive();e.on("pointerup",function(){this.scale.isFullscreen?(e.setFrame(0),this.scale.stopFullscreen()):(e.setFrame(1),this.scale.startFullscreen())},this)}moveActivePiece(e){this.activePiece&&(this.clearTetromino(this.activePiece),T(this.graphics,this.map,this.gameScale,this.activePiece,e),this.updateGhost(),this.setTetromino(this.activePiece))}rotateActivePiece(e){this.clearTetromino(this.activePiece),w(this.graphics,this.map,this.gameScale,this.activePiece,e),this.updateGhost(),this.setTetromino(this.activePiece)}lockTetromino(e){let t=new Set,s=e.getData("cells"),o=e.getData("x"),a=e.getData("y");if(!this.checkFractions(o,a)){for(let l=0;l<s.length;l++)for(let h=0;h<s[l].length-1;h++){if(this.checkFractions(s[l][h],s[l][h+1]))return;t.add(a+s[l][h+1])}t=Array.from(t).sort((l,h)=>h-l);for(let l=0;l<t.length;l++){let h=t[l],g=!0;for(let n=0;n<BOARD_WIDTH;n++){let D=this.getTile(n,h);if(!D||D.index===r.BOARD){g=!1;break}}if(g){for(let n=0;n<BOARD_WIDTH;n++)this.setTile(n,h,r.BOARD);for(let n=h+1;n<BOARD_HEIGHT;n++)for(let D=0;D<BOARD_WIDTH;D++){let d=this.getTile(D,n);d&&d.index!==r.BOARD&&(this.setTile(D,n-1,d.index),this.setTile(D,n,r.BOARD))}}}}}drop(){if(!this.gameOver){for(this.clearTetromino(this.activePiece),this.clearTetromino(this.ghostPiece);T(this.graphics,this.map,this.gameScale,this.activePiece,[0,1]););this.setTetromino(this.activePiece),this.lockTetromino(this.activePiece),this.spawn(),this.setTetromino(this.activePiece),this.elapsed=0}}create(){this.createTileMap(),this.addFullScreenToggle(),this.spawn(),this.input.addPointer(1),this.input.keyboard.on("keydown-LEFT",()=>{this.moveActivePiece([-1,0])}),this.input.keyboard.on("keydown-RIGHT",()=>{this.moveActivePiece([1,0])}),this.input.keyboard.on("keydown-DOWN",()=>{this.moveActivePiece([0,1])}),DEBUG&&this.input.keyboard.on("keydown-UP",()=>{this.moveActivePiece([0,-1])}),this.input.keyboard.on("keydown-E",()=>{this.rotateActivePiece(1)}),this.input.keyboard.on("keydown-Q",()=>{this.rotateActivePiece(-1)}),this.input.keyboard.on("keydown-SPACE",()=>{this.drop()}),this.input.keyboard.on("keydown-P",()=>{this.scene.isPaused()?this.scene.resume():this.scene.pause()}),this.input.keyboard.on("keydown-ESC",()=>{this.map.fill(r.BOARD),this.gameOver=!1,this.spawn(),this.setTetromino(this.activePiece)}),this.graphics=this.add.graphics(),this.setTetromino(this.activePiece),console.log(window.innerWidth,window.innerHeight,window.devicePixelRatio)}spawn(){for(this.activePiece&&this.activePiece.destroy(),this.ghostPiece&&this.ghostPiece.destroy(),this.activePiece=I(this,4,19,this.gameScale),this.ghostPiece=x(this,this.activePiece,this.gameScale);T(this.graphics,this.map,this.gameScale,this.ghostPiece,[0,1]););this.setTetromino(this.ghostPiece)}updateGhost(){for(this.clearTetromino(this.ghostPiece),this.ghostPiece.setData("x",this.activePiece.getData("x")),this.ghostPiece.setData("y",this.activePiece.getData("y")),this.ghostPiece.x=this.map.tileToWorldX(this.activePiece.getData("x")),this.ghostPiece.y=this.map.tileToWorldY(19-this.activePiece.getData("y")),this.ghostPiece.setData("cells",P(this.activePiece.getData("cells"))),this.ghostPiece.setData("rotationIndex",this.activePiece.getData("rotationIndex"));T(this.graphics,this.map,this.gameScale,this.ghostPiece,[0,1]););this.setTetromino(this.ghostPiece)}processTouch(){this.input.activePointer.isDown?(clicked=!0,Math.abs(this.input.activePointer.x-touchDeltaX)>=50?(this.input.activePointer.x<touchDeltaX?swipeDirection="left":this.input.activePointer.x>touchDeltaX&&touchDeltaX!=0?swipeDirection="right":(swipeDirection="",touchDeltaX=0),touchDeltaX=this.input.activePointer.x,swipeDirection!=""&&(this.moveActivePiece([swipeDirection=="left"?-1:1,0]),dragged=!0)):!dropped&&Math.abs(this.input.activePointer.y-touchDeltaY)>=200&&(this.input.activePointer.y>touchDeltaY&&touchDeltaY!=0?swipeDirection="down":(swipeDirection="",touchDeltaY=0),touchDeltaY=this.input.activePointer.y,swipeDirection=="down"&&(this.drop(),dropped=!0))):(touchDeltaX=0,touchDeltaY=0,clicked&&!dragged&&!dropped&&(this.input.activePointer.x<this.center.x?this.rotateActivePiece(-1):this.rotateActivePiece(1)),clicked=!1,dropped=!1,dragged=!1)}update(e,t){this.gameOver||(this.processTouch(),this.elapsed+=t,this.elapsed>1e3&&(this.elapsed=0),this.elapsed===0&&this.activePiece&&!DEBUG&&(this.clearTetromino(this.activePiece),T(this.graphics,this.map,this.gameScale,this.activePiece,[0,1])||(this.setTetromino(this.activePiece),this.lockTetromino(this.activePiece),this.spawn()),this.setTetromino(this.activePiece)))}},H={type:Phaser.WEBGL,scale:{mode:Phaser.Scale.FIT,parent:"jetris",autoCenter:Phaser.Scale.CENTER_BOTH,width:WIDTH,height:HEIGHT},width:WIDTH,height:HEIGHT,backgroundColor:"#2d2d2d",scene:[E]},M=new Phaser.Game(H);})();
