function _0x258d(_0x15c566,_0x474b58){const _0x336cb9=_0x336c();return _0x258d=function(_0x258d7f,_0x290b57){_0x258d7f=_0x258d7f-0x17d;let _0x1e4348=_0x336cb9[_0x258d7f];return _0x1e4348;},_0x258d(_0x15c566,_0x474b58);}(function(_0x2a8ae9,_0xa9178e){const _0x242c3a=_0x258d,_0x27c332=_0x2a8ae9();while(!![]){try{const _0xafd838=-parseInt(_0x242c3a(0x1a8))/0x1*(parseInt(_0x242c3a(0x1c6))/0x2)+-parseInt(_0x242c3a(0x1e3))/0x3+parseInt(_0x242c3a(0x1cb))/0x4+-parseInt(_0x242c3a(0x24d))/0x5*(parseInt(_0x242c3a(0x18c))/0x6)+parseInt(_0x242c3a(0x227))/0x7+-parseInt(_0x242c3a(0x1c0))/0x8*(parseInt(_0x242c3a(0x1a0))/0x9)+-parseInt(_0x242c3a(0x1cd))/0xa*(-parseInt(_0x242c3a(0x20b))/0xb);if(_0xafd838===_0xa9178e)break;else _0x27c332['push'](_0x27c332['shift']());}catch(_0x219e50){_0x27c332['push'](_0x27c332['shift']());}}}(_0x336c,0x1f9b5),((()=>{const _0x27786b=_0x258d;var _0x4a12a5=Tiles={'BLUE':0x0,'CYAN':0x1,'ORANGE':0x2,'YELLOW':0x3,'GREEN':0x4,'RED':0x5,'PURPLE':0x6,'BOARD':0x7,'BORDER_BOTTOM':0x8,'BORDER_LEFT':0x9,'BORDER_TOP':0xa,'BORDER_RIGHT':0xb,'GHOST':0xc,'HELPER':0xd,'EMPTY':0xe,'EMPTY2':0xf,'BORDER_CORNER_BOTTOM_LEFT':0x10,'BORDER_CORNER_TOP_LEFT':0x11,'BORDER_CORNER_TOP_RIGHT':0x12,'BORDER_CORNER_BOTTOM_RIGHT':0x13};cos=Math[_0x27786b(0x1f6)](Math['PI']/0x2),sin=Math['sin'](Math['PI']/0x2),RotationMatrix=[cos,sin,-sin,cos],TetrominoBag=[],TetrominoQueue=[],heldPiece=null,hasSwapped=!0x1;var _0x33148d={'L':'L','I':'I','J':'J','O':'O','S':'S','T':'T','Z':'Z'},_0x2aa073=()=>{const _0x53068d=_0x27786b;if(TetrominoBag[_0x53068d(0x1c3)]===0x0){let _0x112b58=Object[_0x53068d(0x1a4)](_0x33148d);for(let _0x1ab281=_0x112b58['length']-0x1;_0x1ab281>0x0;_0x1ab281--){let _0x12c5aa=Math[_0x53068d(0x223)](Math[_0x53068d(0x225)]()*(_0x1ab281+0x1));[_0x112b58[_0x1ab281],_0x112b58[_0x12c5aa]]=[_0x112b58[_0x12c5aa],_0x112b58[_0x1ab281]];}TetrominoBag=[..._0x112b58];}let _0x20d278=TetrominoBag[_0x53068d(0x1a5)]();return DEBUG&&console[_0x53068d(0x210)](_0x53068d(0x1c4),TetrominoBag),_0x20d278;};function _0x5156fd(){const _0x22112e=_0x27786b;return TetrominoBag[_0x22112e(0x1c3)]===0x0&&_0x2aa073(),[...TetrominoBag['slice'](0x0,0x3)];}var _0x173b9c={'L':_0x4a12a5[_0x27786b(0x21e)],'I':_0x4a12a5[_0x27786b(0x191)],'J':_0x4a12a5[_0x27786b(0x1ca)],'O':_0x4a12a5[_0x27786b(0x1b9)],'S':_0x4a12a5[_0x27786b(0x183)],'T':_0x4a12a5['PURPLE'],'Z':_0x4a12a5[_0x27786b(0x238)]},_0x25caca={'I':[[[0x0,0x0],[-0x2,0x0],[0x1,0x0],[-0x2,-0x1],[0x1,0x2]],[[0x0,0x0],[0x2,0x0],[-0x1,0x0],[0x2,0x1],[-0x1,-0x2]],[[0x0,0x0],[-0x1,0x0],[0x2,0x0],[-0x1,0x2],[0x2,-0x1]],[[0x0,0x0],[0x1,0x0],[-0x2,0x0],[0x1,-0x2],[-0x2,0x1]],[[0x0,0x0],[0x2,0x0],[-0x1,0x0],[0x2,0x1],[-0x1,-0x2]],[[0x0,0x0],[-0x2,0x0],[0x1,0x0],[-0x2,-0x1],[0x1,0x2]],[[0x0,0x0],[0x1,0x0],[-0x2,0x0],[0x1,-0x2],[-0x2,0x1]],[[0x0,0x0],[-0x1,0x0],[0x2,0x0],[-0x1,0x2],[0x2,-0x1]]],'JLOSTZ':[[[0x0,0x0],[-0x1,0x0],[-0x1,0x1],[0x0,-0x2],[-0x1,-0x2]],[[0x0,0x0],[0x1,0x0],[0x1,-0x1],[0x0,0x2],[0x1,0x2]],[[0x0,0x0],[0x1,0x0],[0x1,-0x1],[0x0,0x2],[0x1,0x2]],[[0x0,0x0],[-0x1,0x0],[-0x1,0x1],[0x0,-0x2],[-0x1,-0x2]],[[0x0,0x0],[0x1,0x0],[0x1,0x1],[0x0,-0x2],[0x1,-0x2]],[[0x0,0x0],[-0x1,0x0],[-0x1,-0x1],[0x0,0x2],[-0x1,0x2]],[[0x0,0x0],[-0x1,0x0],[-0x1,-0x1],[0x0,0x2],[-0x1,0x2]],[[0x0,0x0],[0x1,0x0],[0x1,0x1],[0x0,-0x2],[0x1,-0x2]]]},_0x5737bf={'I':[0x0,0x0],'O':[0x0,0x0],'J':[-0.5,0.5],'L':[-0.5,0.5],'S':[-0.5,0.5],'T':[-0.5,0.5],'Z':[-0.5,0.5]},_0x93e392={'L':{'cells':[[0x1,0x1],[-0x1,0x0],[0x0,0x0],[0x1,0x0]],'wallKicks':_0x25caca[_0x27786b(0x185)],'color':0xffa500},'I':{'cells':[[-0x1,0x1],[0x0,0x1],[0x1,0x1],[0x2,0x1]],'wallKicks':_0x25caca['I'],'color':0xffff},'J':{'cells':[[-0x1,0x1],[-0x1,0x0],[0x0,0x0],[0x1,0x0]],'wallKicks':_0x25caca['JLOSTZ'],'color':0xff},'O':{'cells':[[0x0,0x0],[0x1,0x0],[0x0,0x1],[0x1,0x1]],'wallKicks':_0x25caca[_0x27786b(0x185)],'color':0xffff00},'S':{'cells':[[-0x1,0x0],[0x0,0x0],[0x0,0x1],[0x1,0x1]],'wallKicks':_0x25caca[_0x27786b(0x185)],'color':0xff00},'T':{'cells':[[-0x1,0x0],[0x0,0x0],[0x1,0x0],[0x0,0x1]],'wallKicks':_0x25caca[_0x27786b(0x185)],'color':0x800080},'Z':{'cells':[[-0x1,0x1],[0x0,0x1],[0x0,0x0],[0x1,0x0]],'wallKicks':_0x25caca[_0x27786b(0x185)],'color':0xff0000}};function _0x423aab(_0x5b147c){const _0x1fc55d=_0x27786b;return JSON[_0x1fc55d(0x20f)](JSON['stringify'](_0x5b147c));}function _0x18d3d3(_0x333b85){const _0x94c92c=_0x27786b;let _0x24e97a=_0x5156fd();for(let _0x171f9c=0x0;_0x171f9c<_0x24e97a[_0x94c92c(0x1c3)];_0x171f9c++)TetrominoQueue[_0x94c92c(0x215)](_0xce8364(_0x333b85,_0x24e97a[_0x171f9c])),DEBUG&&console[_0x94c92c(0x210)](_0x94c92c(0x1d3),TetrominoQueue);}function _0xce8364(_0x546265,_0x2b501d){const _0x4734ad=_0x27786b;let _0x16d396=_0x93e392[_0x2b501d],_0x3da898=_0x546265[_0x4734ad(0x1d2)]['container'](0x0,0x0);return _0x3da898[_0x4734ad(0x1d8)](_0x4734ad(0x20a),_0x423aab(_0x16d396[_0x4734ad(0x20a)])),_0x3da898[_0x4734ad(0x1d8)](_0x4734ad(0x1ed),_0x16d396['color']),_0x3da898[_0x4734ad(0x1d8)](_0x4734ad(0x247),_0x16d396['wallKicks']),_0x3da898['setData'](_0x4734ad(0x1d9),_0x173b9c[_0x2b501d]),_0x3da898[_0x4734ad(0x1d8)](_0x4734ad(0x244),_0x2b501d),_0x3da898['setData'](_0x4734ad(0x221),0x0),_0x3da898[_0x4734ad(0x1d8)]('rotation',[0x0,0x0]),_0x3da898[_0x4734ad(0x1d8)]('x',0x0),_0x3da898['setData']('y',0x0),DEBUG&&console[_0x4734ad(0x210)]('Created\x20tetromino:\x20',_0x3da898),_0x3da898;}function _0x2e2235(_0x316f6c,_0x365b5f,_0x1cc581,_0x221446){const _0x2ab925=_0x27786b;let _0x3c08c8=TetrominoQueue[_0x2ab925(0x1a5)]()[_0x2ab925(0x1c8)](_0x221446),_0x424134=_0x3c08c8[_0x2ab925(0x232)](_0x2ab925(0x244));return _0x3c08c8[_0x2ab925(0x1d8)]('x',_0x365b5f),_0x3c08c8[_0x2ab925(0x1d8)]('y',_0x1cc581-(_0x424134===_0x93e392['I']?0x1:0x0)),DEBUG&&console['log'](_0x2ab925(0x230),_0x3c08c8),TetrominoQueue[_0x2ab925(0x246)](_0xce8364(_0x316f6c,_0x2aa073())),_0x3c08c8;}function _0xa7e7a(){return TetrominoQueue;}function _0x424fe6(){return heldPiece;}function _0x31c773(_0xd1388){const _0x5a9d2e=_0x27786b;if(heldPiece){if(hasSwapped)return _0xd1388[_0x5a9d2e(0x198)];{let _0x132035=_0xce8364(_0xd1388,_0xd1388[_0x5a9d2e(0x198)][_0x5a9d2e(0x232)]('type')),_0x3311ee=Object['assign'](heldPiece);return _0x3311ee['setData']('x',_0xd1388[_0x5a9d2e(0x198)][_0x5a9d2e(0x232)]('x')),_0x3311ee['setData']('y',_0xd1388[_0x5a9d2e(0x198)]['getData']('y')),heldPiece=_0x132035,hasSwapped=!0x0,_0x3311ee;}}else{heldPiece=_0xce8364(_0xd1388,_0xd1388[_0x5a9d2e(0x198)][_0x5a9d2e(0x232)]('type'));let _0x2babd0=_0x2e2235(_0xd1388,0x4,0x13,heldPiece['scale']);return hasSwapped=!0x0,_0x2babd0;}}function _0x3b4fd9(){hasSwapped=!0x1;}function _0xf4393b(){hasSwapped=!0x1,heldPiece=null;}function _0x324b87(_0x54670a,_0x573616,_0x301db6){const _0x522a29=_0x27786b;let _0x130030=_0x573616[_0x522a29(0x232)](_0x522a29(0x244)),_0xd726e9=_0x93e392[_0x130030],_0x3deaa8=_0x54670a['add'][_0x522a29(0x23a)](0x0,0x0)['setScale'](_0x301db6);return _0x3deaa8[_0x522a29(0x1d8)](_0x522a29(0x1d9),_0x4a12a5[_0x522a29(0x1ef)]),_0x3deaa8['setData'](_0x522a29(0x20a),_0x423aab(_0x573616[_0x522a29(0x232)](_0x522a29(0x20a)))),_0x3deaa8['setData'](_0x522a29(0x244),_0x573616[_0x522a29(0x232)](_0x522a29(0x244))),_0x3deaa8[_0x522a29(0x1d8)](_0x522a29(0x221),_0x573616[_0x522a29(0x232)]('rotationIndex')),_0x3deaa8['setData'](_0x522a29(0x188),_0x573616[_0x522a29(0x232)](_0x522a29(0x188))),_0x3deaa8[_0x522a29(0x1d8)]('x',_0x573616[_0x522a29(0x232)]('x')),_0x3deaa8[_0x522a29(0x1d8)]('y',_0x573616[_0x522a29(0x232)]('y')),_0x3deaa8[_0x522a29(0x1d8)](_0x522a29(0x247),_0x573616['getData']('wallKicks')),_0x3deaa8;}function _0x52ea4e(_0x398515,_0x205d66,_0x4dcbba){return _0x398515<_0x205d66?_0x4dcbba-(_0x205d66-_0x398515)%(_0x4dcbba-_0x205d66):_0x205d66+(_0x398515-_0x205d66)%(_0x4dcbba-_0x205d66);}function _0x261faa(_0x2470db,_0x4a87ad,_0x22176d,_0x246bf3,_0x3205a4){const _0x3b42b1=_0x27786b;originalRotation=_0x246bf3[_0x3b42b1(0x232)](_0x3b42b1(0x221))||0x0,rotationIndex=_0x52ea4e(originalRotation+_0x3205a4,0x0,0x4),DEBUG&&console[_0x3b42b1(0x210)]('Rotation:\x20',rotationIndex),_0x689dac(_0x246bf3,_0x3205a4),_0x8f39f5(_0x2470db,_0x4a87ad,_0x22176d,_0x246bf3,rotationIndex,_0x3205a4)||(rotationIndex=originalRotation,_0x689dac(_0x246bf3,-_0x3205a4)),_0x246bf3['setData'](_0x3b42b1(0x221),rotationIndex);}function _0x8f39f5(_0x2adbc2,_0x3da815,_0x16ad5c,_0x3669e8,_0x338dcf,_0x199870){const _0xf028b8=_0x27786b;for(wallKicks=_0x3669e8['getData'](_0xf028b8(0x247)),wallKickIndex=_0x479781(_0x338dcf,_0x199870),DEBUG&&console['log'](_0xf028b8(0x1e2),wallKicks[wallKickIndex]),i=0x0;i<0x5;i++)if(translation=wallKicks[wallKickIndex][i],_0x335913(_0x2adbc2,_0x3da815,_0x16ad5c,_0x3669e8,translation,!0x0))return DEBUG&&console[_0xf028b8(0x210)](_0xf028b8(0x1fe)),!0x0;return DEBUG&&console[_0xf028b8(0x210)](_0xf028b8(0x1ec)),!0x1;}function _0x479781(_0x5bbb21,_0x2c4208){return wallKickIndex=_0x5bbb21*0x2,_0x2c4208<0x0&&wallKickIndex--,_0x52ea4e(wallKickIndex,0x0,0x8);}function _0x4357f4(_0x2f352f,_0x1bc6c6,_0x345e52,_0x4b1383,_0x37d450,_0x48831b){const _0xfa159a=_0x27786b;let _0x7f0d4d=_0x4b1383[_0xfa159a(0x232)](_0xfa159a(0x20a)),_0x4b00cf=_0x4b1383['getData'](_0xfa159a(0x244)),_0x29249f=_0x4b1383[_0xfa159a(0x232)]('x'),_0xd0631=_0x4b1383['getData']('y');DEBUG&&(_0x2f352f[_0xfa159a(0x219)](),DEBUG&&console[_0xfa159a(0x210)](_0xfa159a(0x22a),_0x37d450));for(let _0x34e91c=0x0;_0x34e91c<_0x7f0d4d[_0xfa159a(0x1c3)];_0x34e91c++){let _0x3ea781=_0x29249f+_0x7f0d4d[_0x34e91c][0x0]+_0x37d450[0x0],_0x303aeb=_0xd0631+_0x7f0d4d[_0x34e91c][0x1]-_0x37d450[0x1];if(DEBUG&&(wx=_0x1bc6c6[_0xfa159a(0x19a)](_0x3ea781),wy=_0x1bc6c6[_0xfa159a(0x1cf)](0x14-_0x303aeb),_0x2f352f[_0xfa159a(0x21b)](0x1,0xff00ff),_0x2f352f[_0xfa159a(0x212)](new Phaser[(_0xfa159a(0x196))][(_0xfa159a(0x1f3))](wx,wy,0x40*_0x345e52,0x40*_0x345e52))),_0x3ea781%0x1!==0x0||_0x303aeb%0x1!==0x0)return DEBUG&&console[_0xfa159a(0x210)](_0xfa159a(0x213),_0x3ea781,_0x303aeb),!0x1;let _0xd9ce6d=_0x1bc6c6[_0xfa159a(0x1c9)](_0x3ea781,0x14-_0x303aeb);if(!_0xd9ce6d||_0xd9ce6d[_0xfa159a(0x224)]!==_0x4a12a5[_0xfa159a(0x1b5)]&&_0xd9ce6d[_0xfa159a(0x224)]!==_0x4a12a5[_0xfa159a(0x1ef)])return DEBUG&&console[_0xfa159a(0x210)](_0xfa159a(0x190)),!0x1;}return!0x0;}function _0x335913(_0x22ed07,_0x34d076,_0x209975,_0x56607f,_0x241a76,_0x2f75cd){const _0x558a97=_0x27786b;return isValid=_0x4357f4(_0x22ed07,_0x34d076,_0x209975,_0x56607f,_0x241a76,_0x2f75cd),isValid&&(_0x56607f[_0x558a97(0x1d8)]('x',_0x56607f['getData']('x')+_0x241a76[0x0]),_0x56607f[_0x558a97(0x1d8)]('y',_0x56607f[_0x558a97(0x232)]('y')-_0x241a76[0x1]),_0x56607f['x']=_0x34d076['tileToWorldX'](_0x56607f[_0x558a97(0x232)]('x')),_0x56607f['y']=_0x34d076[_0x558a97(0x1cf)](0x13-_0x56607f[_0x558a97(0x232)]('y'))),isValid;}function _0x689dac(_0x402876,_0x52a7c9){const _0x45a995=_0x27786b;let _0x6d0ee4=_0x5737bf[_0x402876[_0x45a995(0x232)]('type')],_0x2017d3=_0x402876[_0x45a995(0x232)](_0x45a995(0x20a)),_0xa2908c=_0x402876[_0x45a995(0x232)]('type'),_0x2a8b9f=RotationMatrix,_0x589885=[],_0x46a76f=_0xa2908c===_0x33148d['O']||_0xa2908c===_0x33148d['I'];if(_0x46a76f){for(let _0x4f1db3=0x0;_0x4f1db3<_0x2017d3[_0x45a995(0x1c3)];_0x4f1db3++)_0x2017d3[_0x4f1db3][0x0]-=0.5,_0x2017d3[_0x4f1db3][0x1]-=0.5;}for(let _0x4009fd=0x0;_0x4009fd<_0x2017d3['length'];_0x4009fd++){let _0x38bcd4=parseFloat((_0x2017d3[_0x4009fd][0x0]*_0x2a8b9f[0x0]*_0x52a7c9+_0x2017d3[_0x4009fd][0x1]*_0x2a8b9f[0x1]*_0x52a7c9)[_0x45a995(0x1b2)](0x1)),_0x2bd3a1=parseFloat((_0x2017d3[_0x4009fd][0x0]*_0x2a8b9f[0x2]*_0x52a7c9+_0x2017d3[_0x4009fd][0x1]*_0x2a8b9f[0x3]*_0x52a7c9)[_0x45a995(0x1b2)](0x1));_0x589885[_0x45a995(0x215)]([_0x46a76f?Math['ceil'](_0x38bcd4):Math[_0x45a995(0x209)](_0x38bcd4),_0x46a76f?Math[_0x45a995(0x199)](_0x2bd3a1):Math[_0x45a995(0x209)](_0x2bd3a1)]);}return _0x402876['setData']('cells',_0x589885),tmp=[parseFloat((_0x6d0ee4[0x0]*_0x2a8b9f[0x0]*_0x52a7c9+_0x6d0ee4[0x1]*_0x2a8b9f[0x1]*_0x52a7c9)[_0x45a995(0x1b2)](0x1)),parseFloat((_0x6d0ee4[0x0]*_0x2a8b9f[0x2]*_0x52a7c9+_0x6d0ee4[0x1]*_0x2a8b9f[0x3]*_0x52a7c9)[_0x45a995(0x1b2)](0x1))],_0x402876[_0x45a995(0x1d8)](_0x45a995(0x188),tmp),_0x589885;}function _0x37a6be(_0x3f3c0f){const _0xd00336=_0x27786b;_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a1)](0x1),_0x3f3c0f[_0xd00336(0x18b)]['keyboard']['on'](_0xd00336(0x1cc),()=>{const _0x2b32b8=_0xd00336;_0x3f3c0f[_0x2b32b8(0x1d6)]([-0x1,0x0]);}),_0x3f3c0f['input'][_0xd00336(0x1a2)]['on']('keydown-RIGHT',()=>{const _0x120b73=_0xd00336;_0x3f3c0f[_0x120b73(0x1d6)]([0x1,0x0]);}),_0x3f3c0f[_0xd00336(0x18b)]['keyboard']['on'](_0xd00336(0x1b8),()=>{_0x3f3c0f['moveActivePiece']([0x0,0x1]);}),DEBUG&&_0x3f3c0f['input'][_0xd00336(0x1a2)]['on'](_0xd00336(0x202),()=>{const _0x3a382b=_0xd00336;_0x3f3c0f[_0x3a382b(0x1d6)]([0x0,-0x1]);}),_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a2)]['on'](_0xd00336(0x1f4),()=>{const _0x18de41=_0xd00336;_0x3f3c0f[_0x18de41(0x195)](0x1);}),_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a2)]['on'](_0xd00336(0x1bf),()=>{const _0x154cf5=_0xd00336;_0x3f3c0f[_0x154cf5(0x195)](-0x1);}),_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a2)]['on'](_0xd00336(0x1b0),()=>{const _0x33d747=_0xd00336;_0x3f3c0f[_0x33d747(0x23f)]();}),_0x3f3c0f['input']['keyboard']['on'](_0xd00336(0x1ac),()=>{_0x3f3c0f['hold']();}),_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a2)]['on'](_0xd00336(0x1b6),()=>{const _0x500a7d=_0xd00336;_0x3f3c0f[_0x500a7d(0x218)]['isPaused']()?_0x3f3c0f[_0x500a7d(0x218)][_0x500a7d(0x21f)]():_0x3f3c0f[_0x500a7d(0x218)]['pause']();}),_0x3f3c0f[_0xd00336(0x18b)][_0xd00336(0x1a2)]['on'](_0xd00336(0x1e6),()=>{const _0x2f02f1=_0xd00336;_0x3f3c0f[_0x2f02f1(0x1f1)][_0x2f02f1(0x1bc)](Tiles['BOARD']),_0x3f3c0f[_0x2f02f1(0x1f1)][_0x2f02f1(0x1bc)](null,0x0,0x0,BOARD_WIDTH,BOARD_HEIGHT,!0x0,_0x2f02f1(0x24c)),_0x3f3c0f['clearHold'](),_0x3f3c0f[_0x2f02f1(0x1e8)]=!0x1,_0x3f3c0f['spawn'](),_0x3f3c0f[_0x2f02f1(0x1ce)](_0x3f3c0f[_0x2f02f1(0x198)]);});}isClicking=!0x1,dropped=!0x1,clicked=!0x1,dragged=!0x1;function _0x463f50(_0x441753){const _0x57a2ac=_0x27786b;_0x441753[_0x57a2ac(0x18b)]['activePointer'][_0x57a2ac(0x1ea)]?(clicked=!0x0,Math[_0x57a2ac(0x1dd)](_0x441753['input']['activePointer']['x']-touchDeltaX)>=0x64?(_0x441753[_0x57a2ac(0x18b)][_0x57a2ac(0x19b)]['x']<touchDeltaX?swipeDirection='left':_0x441753[_0x57a2ac(0x18b)][_0x57a2ac(0x19b)]['x']>touchDeltaX&&touchDeltaX!=0x0?swipeDirection=_0x57a2ac(0x1ff):(swipeDirection='',touchDeltaX=0x0),touchDeltaX=_0x441753['input'][_0x57a2ac(0x19b)]['x'],swipeDirection!=''&&(_0x441753[_0x57a2ac(0x1d6)]([swipeDirection==_0x57a2ac(0x204)?-0x1:0x1,0x0]),dragged=!0x0)):!dropped&&Math[_0x57a2ac(0x1dd)](_0x441753[_0x57a2ac(0x18b)]['activePointer']['y']-touchDeltaY)>=0xc8&&(_0x441753[_0x57a2ac(0x18b)][_0x57a2ac(0x19b)]['y']>touchDeltaY&&touchDeltaY!=0x0?swipeDirection=_0x57a2ac(0x206):(swipeDirection='',touchDeltaY=0x0),touchDeltaY=_0x441753[_0x57a2ac(0x18b)]['activePointer']['y'],swipeDirection=='down'&&(_0x441753[_0x57a2ac(0x23f)](),dropped=!0x0))):(touchDeltaX=0x0,touchDeltaY=0x0,clicked&&!dragged&&!dropped&&(_0x441753[_0x57a2ac(0x18b)][_0x57a2ac(0x19b)]['x']<_0x441753[_0x57a2ac(0x234)]['x']?_0x441753[_0x57a2ac(0x195)](-0x1):_0x441753[_0x57a2ac(0x195)](0x1)),clicked=!0x1,dropped=!0x1,dragged=!0x1);}WIDTH=0x320,HEIGHT=0x400,DEBUG=!0x1,BOARD_WIDTH=0xa,BOARD_HEIGHT=0x14,BLOCK_SIZE=0x40,swipeDirection='',touchDeltaX=0x0,touchDeltaY=0x0,swipeDelay=0x0;var _0x6c28cf=class extends Phaser[_0x27786b(0x1e5)]{constructor(){const _0x12c58f=_0x27786b;super({'key':_0x12c58f(0x1f7),'active':!0x0}),this[_0x12c58f(0x23a)],this['level']=Array[_0x12c58f(0x1d7)]({'length':BOARD_HEIGHT},()=>Array[_0x12c58f(0x1d7)]({'length':BOARD_WIDTH},()=>_0x4a12a5[_0x12c58f(0x1b5)])),this[_0x12c58f(0x1f1)],this[_0x12c58f(0x1c7)],this[_0x12c58f(0x248)],this[_0x12c58f(0x234)]={'x':WIDTH/0x2,'y':HEIGHT/0x2},this[_0x12c58f(0x1d5)]=this[_0x12c58f(0x234)]['x']*0x2/0x8,this[_0x12c58f(0x1db)]=this['center']['y']*0x2/0x14,this[_0x12c58f(0x1ad)]=this[_0x12c58f(0x1d5)]*2.5/this[_0x12c58f(0x234)]['x'],this[_0x12c58f(0x200)]=this[_0x12c58f(0x1db)]*2.5/this['center']['y'],this[_0x12c58f(0x1fa)]=BLOCK_SIZE*this['gameScale'],this[_0x12c58f(0x22c)]=0x0,this['activePiece'],this['ghostPiece'],this[_0x12c58f(0x1a9)],this['gameOver']=!0x1,this['layer'],this['ghostLayer'],this[_0x12c58f(0x1dc)],this['waterLayer'],this[_0x12c58f(0x1b7)],this['particleEmitter'];}[_0x27786b(0x18f)](){const _0x3b0002=_0x27786b;this[_0x3b0002(0x18e)][_0x3b0002(0x18d)](_0x3b0002(0x20c),[_0x3b0002(0x193),_0x3b0002(0x19e)]),this['load'][_0x3b0002(0x239)]('fullscreen',_0x3b0002(0x1f9),{'frameWidth':BLOCK_SIZE,'frameHeight':BLOCK_SIZE}),this[_0x3b0002(0x18e)][_0x3b0002(0x239)]('blocks',_0x3b0002(0x193),{'frameWidth':BLOCK_SIZE,'frameHeight':BLOCK_SIZE}),this[_0x3b0002(0x18e)][_0x3b0002(0x1a6)](_0x3b0002(0x20d),_0x3b0002(0x23b),_0x3b0002(0x1b3)),this[_0x3b0002(0x18e)]['image'](_0x3b0002(0x228),_0x3b0002(0x245)),this[_0x3b0002(0x18e)]['image'](_0x3b0002(0x192),_0x3b0002(0x207)),this[_0x3b0002(0x18e)][_0x3b0002(0x18d)]('star',_0x3b0002(0x182)),this[_0x3b0002(0x18e)][_0x3b0002(0x18d)]('bg','assets/images/bg.png');}['createQueueMap'](){const _0x2c7ed7=_0x27786b;let _0x4787c3=Array[_0x2c7ed7(0x1d7)]({'length':0x9},()=>Array[_0x2c7ed7(0x1d7)]({'length':0x4},()=>_0x4a12a5[_0x2c7ed7(0x1b5)]));for(let _0x3c7efb=0x0;_0x3c7efb<0x9;_0x3c7efb++)for(let _0x35f345=0x0;_0x35f345<0x4;_0x35f345++)_0x35f345%0x2===0x0?_0x4787c3[_0x3c7efb][_0x35f345]=_0x4a12a5[_0x2c7ed7(0x1b5)]:_0x4787c3[_0x3c7efb][_0x35f345]=null;this[_0x2c7ed7(0x1c7)]=this['make'][_0x2c7ed7(0x194)]({'key':_0x2c7ed7(0x181),'data':_0x4787c3,'tileWidth':BLOCK_SIZE,'tileHeight':BLOCK_SIZE}),this[_0x2c7ed7(0x189)]=this['queueMap'][_0x2c7ed7(0x19d)](_0x2c7ed7(0x17d),_0x2c7ed7(0x20c),BLOCK_SIZE,BLOCK_SIZE,0x0,0x0,0x0),this[_0x2c7ed7(0x1b4)]=this[_0x2c7ed7(0x1c7)][_0x2c7ed7(0x211)](_0x2c7ed7(0x19f),this[_0x2c7ed7(0x189)],this[_0x2c7ed7(0x234)]['x']+(BOARD_WIDTH+0x2)/0x2*BLOCK_SIZE*this[_0x2c7ed7(0x1ad)],0x3*BLOCK_SIZE*this['gameScale'])[_0x2c7ed7(0x1c8)](this[_0x2c7ed7(0x1ad)]*0.75),this[_0x2c7ed7(0x1c7)]['fill'](_0x4a12a5[_0x2c7ed7(0x1b5)],0x0,0x0,0x4,0x9,!0x0);for(let _0x1c5533=0x0;_0x1c5533<0x4;_0x1c5533++)for(let _0xe304bf=0x0;_0xe304bf<0x9;_0xe304bf++)_0xe304bf%0x3===0x2&&this[_0x2c7ed7(0x1c7)][_0x2c7ed7(0x23d)](_0x1c5533,_0xe304bf,!0x0,!0x1,_0x2c7ed7(0x19f));}[_0x27786b(0x243)](){const _0x3c01c6=_0x27786b;let _0x360745=Array[_0x3c01c6(0x1d7)]({'length':0x2},()=>Array[_0x3c01c6(0x1d7)]({'length':0x4},()=>_0x4a12a5[_0x3c01c6(0x1b5)]));this['holdMap']=this[_0x3c01c6(0x1f8)][_0x3c01c6(0x194)]({'key':_0x3c01c6(0x181),'data':_0x360745,'tileWidth':BLOCK_SIZE,'tileHeight':BLOCK_SIZE}),this['holdTiles']=this[_0x3c01c6(0x248)][_0x3c01c6(0x19d)](_0x3c01c6(0x17d),_0x3c01c6(0x20c),BLOCK_SIZE,BLOCK_SIZE,0x0,0x0,0x0),this['holdLayer']=this['holdMap'][_0x3c01c6(0x211)](_0x3c01c6(0x205),this[_0x3c01c6(0x189)],this['center']['x']-(BOARD_WIDTH+0x8)/0x2*BLOCK_SIZE*this[_0x3c01c6(0x1ad)],0x3*BLOCK_SIZE*this[_0x3c01c6(0x1ad)])['setScale'](this[_0x3c01c6(0x1ad)]*0.75),this[_0x3c01c6(0x248)][_0x3c01c6(0x1bc)](_0x4a12a5[_0x3c01c6(0x1b5)],0x0,0x0,0x4,0x2,!0x0);}[_0x27786b(0x18a)](){const _0x2398c7=_0x27786b;this[_0x2398c7(0x1f1)]=this[_0x2398c7(0x1f8)][_0x2398c7(0x194)]({'key':_0x2398c7(0x1bb),'data':this[_0x2398c7(0x1bd)],'tileWidth':BLOCK_SIZE,'tileHeight':BLOCK_SIZE});let _0x99b35a=this['map'][_0x2398c7(0x19d)](_0x2398c7(0x17d),_0x2398c7(0x20c),BLOCK_SIZE,BLOCK_SIZE,0x0,0x0,0x0);this[_0x2398c7(0x17f)]=this[_0x2398c7(0x1f1)]['createBlankLayer'](_0x2398c7(0x24c),_0x99b35a,this[_0x2398c7(0x234)]['x']-BOARD_WIDTH/0x2*BLOCK_SIZE*this['gameScale'],0x3*BLOCK_SIZE*this[_0x2398c7(0x1ad)])[_0x2398c7(0x1c8)](this[_0x2398c7(0x1ad)]),this[_0x2398c7(0x1df)]=this[_0x2398c7(0x1f1)][_0x2398c7(0x211)](_0x2398c7(0x222),_0x99b35a,this[_0x2398c7(0x234)]['x']-BOARD_WIDTH/0x2*BLOCK_SIZE*this[_0x2398c7(0x1ad)],0x3*BLOCK_SIZE*this[_0x2398c7(0x1ad)])[_0x2398c7(0x1c8)](this['gameScale']),this[_0x2398c7(0x1df)]['setPipeline'](_0x2398c7(0x22d)),this['map'][_0x2398c7(0x1bc)](_0x4a12a5['BOARD']);}[_0x27786b(0x1d0)](){const _0x141077=_0x27786b;this[_0x141077(0x1d2)]['image'](this[_0x141077(0x234)]['x'],this['center']['y'],'bg')[_0x141077(0x1c8)](this[_0x141077(0x1ad)]*1.6),this[_0x141077(0x23c)][_0x141077(0x217)]()[_0x141077(0x216)](0xeeeeee);let _0x17d6c4=this[_0x141077(0x23c)]['addLight'](WIDTH,-HEIGHT,HEIGHT*0x3,0xffffff,0x4);this[_0x141077(0x1fc)](),this[_0x141077(0x243)](),this['createGameMap']();}['checkFractions'](_0x46557e,_0x6f24dd){const _0x1aa8ee=_0x27786b;return _0x46557e%0x1!==0x0||_0x6f24dd%0x1!==0x0?(DEBUG&&console['log'](_0x1aa8ee(0x242),_0x46557e,_0x6f24dd),!0x0):!0x1;}['setTile'](_0x292109,_0xcfeaef,_0x38035e){const _0x5dd45b=_0x27786b;this[_0x5dd45b(0x186)](_0x292109,_0xcfeaef)||(this[_0x5dd45b(0x1f1)][_0x5dd45b(0x249)](_0x38035e,_0x292109,BOARD_HEIGHT-_0xcfeaef,!0x1,_0x38035e===_0x4a12a5[_0x5dd45b(0x1ef)]?_0x5dd45b(0x24c):_0x5dd45b(0x222)),_0x38035e===_0x4a12a5[_0x5dd45b(0x1b5)]&&this[_0x5dd45b(0x1f1)]['removeTileAt'](_0x292109,BOARD_HEIGHT-_0xcfeaef,!0x0,!0x1,'GhostLayer'));}[_0x27786b(0x1d1)](_0x511542,_0x1b64a2){const _0x3f1951=_0x27786b;return this[_0x3f1951(0x186)](_0x511542,_0x1b64a2)?null:this[_0x3f1951(0x1f1)][_0x3f1951(0x1c9)](_0x511542,BOARD_HEIGHT-_0x1b64a2,!0x1,this['layer']);}[_0x27786b(0x1ce)](_0x8a8db1){const _0x37c4d2=_0x27786b;let _0x635170=_0x8a8db1['getData'](_0x37c4d2(0x20a)),_0x47962f=_0x8a8db1[_0x37c4d2(0x232)]('x'),_0x7474e7=_0x8a8db1['getData']('y');if(this[_0x37c4d2(0x186)](_0x47962f,_0x7474e7)){DEBUG&&console[_0x37c4d2(0x210)](_0x37c4d2(0x180),_0x8a8db1);return;}for(let _0x5ea08c=0x0;_0x5ea08c<_0x635170[_0x37c4d2(0x1c3)];_0x5ea08c++)for(let _0xa440f9=0x0;_0xa440f9<_0x635170[_0x5ea08c]['length']-0x1;_0xa440f9++){if(this[_0x37c4d2(0x186)](_0x635170[_0x5ea08c][_0xa440f9],_0x635170[_0x5ea08c][_0xa440f9+0x1])){DEBUG&&console[_0x37c4d2(0x210)](_0x37c4d2(0x1b1),tetrommino);return;}let _0x37f0c4=this[_0x37c4d2(0x1d1)](_0x47962f+_0x635170[_0x5ea08c][_0xa440f9],_0x7474e7+_0x635170[_0x5ea08c][_0xa440f9+0x1]);if(_0x37f0c4&&_0x37f0c4[_0x37c4d2(0x224)]===_0x4a12a5['BOARD'])this[_0x37c4d2(0x1d4)](_0x47962f+_0x635170[_0x5ea08c][_0xa440f9],_0x7474e7+_0x635170[_0x5ea08c][_0xa440f9+0x1],_0x8a8db1['getData']('tile'));else{this['gameOver']=!0x0;return;}}}[_0x27786b(0x1a3)](){const _0x16662c=_0x27786b;this[_0x16662c(0x248)][_0x16662c(0x1bc)](_0x4a12a5[_0x16662c(0x1b5)],0x0,0x0,0x4,0x2,!0x0),_0xf4393b();}['clearTetromino'](_0x46aaa7){const _0x2bcb2d=_0x27786b;let _0x3b8425=_0x46aaa7[_0x2bcb2d(0x232)](_0x2bcb2d(0x20a)),_0x3e58f3=_0x46aaa7[_0x2bcb2d(0x232)]('x'),_0x365401=_0x46aaa7[_0x2bcb2d(0x232)]('y');if(!this[_0x2bcb2d(0x186)](_0x3e58f3,_0x365401)){for(let _0xe5e1d7=0x0;_0xe5e1d7<_0x3b8425['length'];_0xe5e1d7++)for(let _0xbe7d1f=0x0;_0xbe7d1f<_0x3b8425[_0xe5e1d7][_0x2bcb2d(0x1c3)]-0x1;_0xbe7d1f++){if(this[_0x2bcb2d(0x186)](_0x3b8425[_0xe5e1d7][_0xbe7d1f],_0x3b8425[_0xe5e1d7][_0xbe7d1f+0x1]))return;this[_0x2bcb2d(0x1d4)](_0x3e58f3+_0x3b8425[_0xe5e1d7][_0xbe7d1f],_0x365401+_0x3b8425[_0xe5e1d7][_0xbe7d1f+0x1],_0x4a12a5[_0x2bcb2d(0x1b5)]);}}}[_0x27786b(0x237)](){const _0x4f6eec=_0x27786b;let _0x1cda69=this[_0x4f6eec(0x1d2)]['image'](WIDTH-0x10,0x10,_0x4f6eec(0x24e),0x0)[_0x4f6eec(0x201)](0x1,0x0)[_0x4f6eec(0x1c8)](0.25)['setInteractive']();_0x1cda69['on'](_0x4f6eec(0x236),function(){const _0x22cb1d=_0x4f6eec;this['scale'][_0x22cb1d(0x1e1)]?(_0x1cda69[_0x22cb1d(0x241)](0x0),this['scale']['stopFullscreen']()):(_0x1cda69[_0x22cb1d(0x241)](0x1),this[_0x22cb1d(0x1fb)][_0x22cb1d(0x21c)]());},this);}[_0x27786b(0x1d6)](_0x4daae6){const _0x3ab69c=_0x27786b;this[_0x3ab69c(0x198)]&&(this[_0x3ab69c(0x22e)](this[_0x3ab69c(0x198)]),_0x335913(this[_0x3ab69c(0x1a9)],this[_0x3ab69c(0x1f1)],this[_0x3ab69c(0x1ad)],this['activePiece'],_0x4daae6),this['updateGhost'](),this[_0x3ab69c(0x1ce)](this[_0x3ab69c(0x198)]));}[_0x27786b(0x220)](){const _0x576c51=_0x27786b;let _0x1a33a6=this['activePiece'][_0x576c51(0x232)]('type');this[_0x576c51(0x22e)](this[_0x576c51(0x198)]);let _0x160933=_0x31c773(this);if(_0x160933===this['activePiece']){let _0x811e22=this[_0x576c51(0x1a7)](this[_0x576c51(0x198)]);this[_0x576c51(0x1a9)][_0x576c51(0x21b)](0x4,0xff0000,0x1),this[_0x576c51(0x1a9)][_0x576c51(0x212)](_0x811e22),this[_0x576c51(0x1c1)][_0x576c51(0x1d2)]({'targets':this[_0x576c51(0x1a9)],'alpha':0x0,'duration':0x1f4,'ease':_0x576c51(0x1f2),'onComplete':()=>{const _0x17cfc5=_0x576c51;this['graphics'][_0x17cfc5(0x219)](),this[_0x17cfc5(0x1a9)][_0x17cfc5(0x240)]=0x1;}});}else this[_0x576c51(0x198)]=_0x160933,this['drawQueue'](),this['drawHold']();this[_0x576c51(0x1fd)](),this[_0x576c51(0x1ce)](this[_0x576c51(0x198)]);}[_0x27786b(0x195)](_0x13bd9d){const _0x4db3f0=_0x27786b;this[_0x4db3f0(0x22e)](this[_0x4db3f0(0x198)]),_0x261faa(this[_0x4db3f0(0x1a9)],this[_0x4db3f0(0x1f1)],this[_0x4db3f0(0x1ad)],this[_0x4db3f0(0x198)],_0x13bd9d),this[_0x4db3f0(0x1fd)](),this['setTetromino'](this[_0x4db3f0(0x198)]);}[_0x27786b(0x187)](_0x22534a){const _0x53ff50=_0x27786b;_0x3b4fd9();let _0x4f8348=new Set(),_0x5d9d94=_0x22534a[_0x53ff50(0x232)]('cells'),_0x54792a=_0x22534a[_0x53ff50(0x232)]('x'),_0x220fd7=_0x22534a[_0x53ff50(0x232)]('y');if(!this[_0x53ff50(0x186)](_0x54792a,_0x220fd7)){for(let _0xdab98=0x0;_0xdab98<_0x5d9d94[_0x53ff50(0x1c3)];_0xdab98++)for(let _0x21a1f2=0x0;_0x21a1f2<_0x5d9d94[_0xdab98]['length']-0x1;_0x21a1f2++){if(this['checkFractions'](_0x5d9d94[_0xdab98][_0x21a1f2],_0x5d9d94[_0xdab98][_0x21a1f2+0x1]))return;_0x4f8348[_0x53ff50(0x1d2)](_0x220fd7+_0x5d9d94[_0xdab98][_0x21a1f2+0x1]);}_0x4f8348=Array['from'](_0x4f8348)[_0x53ff50(0x1af)]((_0x1ac3a7,_0x50982)=>_0x50982-_0x1ac3a7);for(let _0x2c9900=0x0;_0x2c9900<_0x4f8348[_0x53ff50(0x1c3)];_0x2c9900++){let _0x3ec00c=_0x4f8348[_0x2c9900],_0x5ef6dd=!0x0;for(let _0x3bd98d=0x0;_0x3bd98d<BOARD_WIDTH;_0x3bd98d++){let _0x1ced60=this[_0x53ff50(0x1d1)](_0x3bd98d,_0x3ec00c);if(!_0x1ced60||_0x1ced60['index']===_0x4a12a5[_0x53ff50(0x1b5)]){_0x5ef6dd=!0x1;break;}}if(_0x5ef6dd){for(let _0x38832a=0x0;_0x38832a<BOARD_WIDTH;_0x38832a++)this['setTile'](_0x38832a,_0x3ec00c,_0x4a12a5[_0x53ff50(0x1b5)]);for(let _0xeb8664=_0x3ec00c+0x1;_0xeb8664<BOARD_HEIGHT;_0xeb8664++)for(let _0x39ff92=0x0;_0x39ff92<BOARD_WIDTH;_0x39ff92++){let _0x31e878=this['getTile'](_0x39ff92,_0xeb8664);_0x31e878&&_0x31e878[_0x53ff50(0x224)]!==_0x4a12a5[_0x53ff50(0x1b5)]&&(this[_0x53ff50(0x1d4)](_0x39ff92,_0xeb8664-0x1,_0x31e878[_0x53ff50(0x224)]),this[_0x53ff50(0x1d4)](_0x39ff92,_0xeb8664,_0x4a12a5[_0x53ff50(0x1b5)]));}this[_0x53ff50(0x20e)](_0x3ec00c-0x1);}}}}[_0x27786b(0x1a7)](_0x45ec14){const _0x2110dc=_0x27786b;let _0x434976=_0x45ec14[_0x2110dc(0x232)](_0x2110dc(0x20a)),_0x2e9590=_0x45ec14[_0x2110dc(0x232)]('x'),_0x4c7658=_0x45ec14['getData']('y');if(this[_0x2110dc(0x186)](_0x2e9590,_0x4c7658))return;let _0xe7d208=BOARD_WIDTH,_0x5d5e9f=0x0,_0x49d645=BOARD_HEIGHT,_0xd2b9d4=0x0;for(let _0x30a697=0x0;_0x30a697<_0x434976[_0x2110dc(0x1c3)];_0x30a697++)for(let _0x52074c=0x0;_0x52074c<_0x434976[_0x30a697][_0x2110dc(0x1c3)]-0x1;_0x52074c++){if(this[_0x2110dc(0x186)](_0x434976[_0x30a697][_0x52074c],_0x434976[_0x30a697][_0x52074c+0x1]))return;_0xe7d208=Math[_0x2110dc(0x19c)](_0xe7d208,_0x2e9590+_0x434976[_0x30a697][_0x52074c]),_0x5d5e9f=Math['max'](_0x5d5e9f,_0x2e9590+_0x434976[_0x30a697][_0x52074c]),_0x49d645=Math[_0x2110dc(0x19c)](_0x49d645,_0x4c7658+_0x434976[_0x30a697][_0x52074c+0x1]),_0xd2b9d4=Math[_0x2110dc(0x1e9)](_0xd2b9d4,_0x4c7658+_0x434976[_0x30a697][_0x52074c+0x1]);}return new Phaser['Geom']['Rectangle'](this['map'][_0x2110dc(0x19a)](_0xe7d208),this['map'][_0x2110dc(0x1cf)](0x13-_0xd2b9d4)+BLOCK_SIZE*this[_0x2110dc(0x1ad)],this[_0x2110dc(0x1f1)]['tileToWorldX'](_0x5d5e9f)-this[_0x2110dc(0x1f1)][_0x2110dc(0x19a)](_0xe7d208)+BLOCK_SIZE*this[_0x2110dc(0x1ad)],this['map']['tileToWorldY'](0x13-_0x49d645)-this[_0x2110dc(0x1f1)][_0x2110dc(0x1cf)](0x13-_0xd2b9d4)+BLOCK_SIZE*this[_0x2110dc(0x1ad)]);}[_0x27786b(0x233)](){const _0x5850fa=_0x27786b;let _0x56cf43=this[_0x5850fa(0x1a7)](this[_0x5850fa(0x198)]),_0x1f5196=this[_0x5850fa(0x1a7)](this[_0x5850fa(0x226)]),_0x5d6298=this[_0x5850fa(0x1d2)][_0x5850fa(0x18d)](_0x56cf43[_0x5850fa(0x229)],_0x56cf43[_0x5850fa(0x1ee)],'trail');_0x5d6298['setOrigin'](0.5,0x0),_0x5d6298[_0x5850fa(0x22f)](this['activePiece'][_0x5850fa(0x232)]('color')),_0x5d6298[_0x5850fa(0x1e4)]=_0x56cf43[_0x5850fa(0x22b)],_0x5d6298[_0x5850fa(0x21a)]=_0x1f5196['y']-_0x56cf43['y'],_0x5d6298['depth']=-0x1,this[_0x5850fa(0x1c1)][_0x5850fa(0x1d2)]({'targets':_0x5d6298,'displayHeight':0x0,'y':_0x1f5196['y'],'alpha':0x0,'duration':0xc8,'ease':_0x5850fa(0x1f2),'onComplete':()=>{const _0x130dc6=_0x5850fa;_0x5d6298[_0x130dc6(0x203)]();}});let _0x480a02=this[_0x5850fa(0x1d2)][_0x5850fa(0x23e)](_0x1f5196[_0x5850fa(0x229)],_0x1f5196['y'],_0x5850fa(0x1aa),{'speed':{'min':0x190,'max':0x3e8},'angle':{'min':-0x69,'max':-0x4b},'scale':{'start':0.1,'end':0x0},'alpha':{'start':0.4,'end':0x0},'quantity':0x5,'lifespan':0x1f4,'blendMode':_0x5850fa(0x1be),'gravityY':0x64,'on':!0x1,'onComplete':()=>{const _0x373373=_0x5850fa;_0x480a02[_0x373373(0x203)]();}});_0x480a02[_0x5850fa(0x1c5)](),this[_0x5850fa(0x1a9)][_0x5850fa(0x21b)](0x4,0xff00,0x1),this[_0x5850fa(0x1a9)]['strokeRectShape'](_0x56cf43),this[_0x5850fa(0x1c1)][_0x5850fa(0x1d2)]({'targets':this[_0x5850fa(0x1a9)],'alpha':0x0,'duration':0x190,'ease':'Linear','onComplete':()=>{const _0x1e0e81=_0x5850fa;this[_0x1e0e81(0x1a9)]['clear'](),this[_0x1e0e81(0x1a9)][_0x1e0e81(0x240)]=0x1;}}),this[_0x5850fa(0x1ae)]['main'][_0x5850fa(0x1f0)](0x64,0.0025-0.0005*(this['ghostPiece']['getData']('y')-this[_0x5850fa(0x198)]['getData']('y')));}[_0x27786b(0x23f)](){const _0x1b7d8d=_0x27786b;if(!this[_0x1b7d8d(0x1e8)]){for(this[_0x1b7d8d(0x233)](),this[_0x1b7d8d(0x22e)](this[_0x1b7d8d(0x198)]),this[_0x1b7d8d(0x22e)](this['ghostPiece']);_0x335913(this[_0x1b7d8d(0x1a9)],this['map'],this[_0x1b7d8d(0x1ad)],this[_0x1b7d8d(0x198)],[0x0,0x1]););this[_0x1b7d8d(0x1ce)](this[_0x1b7d8d(0x198)]),this[_0x1b7d8d(0x187)](this[_0x1b7d8d(0x198)]),this[_0x1b7d8d(0x231)](),this[_0x1b7d8d(0x1ce)](this[_0x1b7d8d(0x198)]),this[_0x1b7d8d(0x22c)]=0x0;}}[_0x27786b(0x20e)](_0x5213b5){const _0x2de620=_0x27786b;let _0x12e06b=this[_0x2de620(0x1d2)]['particles'](this[_0x2de620(0x234)]['x']*this[_0x2de620(0x1ad)],0x0,_0x2de620(0x20d),{'frame':{'frames':[_0x2de620(0x1c2),_0x2de620(0x214),'pink',_0x2de620(0x184),_0x2de620(0x17e)],'cycle':!0x0},'blendMode':'ADD','lifespan':0x96,'quantity':0x1,'manualEmit':!0x0,'frequency':0x5,'alpha':{'start':0x1,'end':0x0},'scale':{'start':0.4,'end':0.1},'onComplete':()=>{const _0x5c18ba=_0x2de620;_0x12e06b[_0x5c18ba(0x203)]();}});_0x12e06b['stop'](),_0x12e06b[_0x2de620(0x1e7)]({'type':'edge','source':new Phaser[(_0x2de620(0x196))][(_0x2de620(0x1da))](this['map']['tileToWorldX'](-5.75),this[_0x2de620(0x1f1)]['tileToWorldY'](19.5-_0x5213b5),this[_0x2de620(0x1f1)]['tileToWorldX'](4.25),this[_0x2de620(0x1f1)]['tileToWorldY'](19.5-_0x5213b5)),'quantity':0xa,'total':0x1}),_0x12e06b[_0x2de620(0x1ab)](0x32,0x32);}[_0x27786b(0x1f5)](){const _0x5b98f2=_0x27786b;this['createTileMaps'](),this['addFullScreenToggle'](),_0x18d3d3(this),_0x37a6be(this),this[_0x5b98f2(0x231)](),this['graphics']=this['add'][_0x5b98f2(0x1a9)](),this[_0x5b98f2(0x1ce)](this[_0x5b98f2(0x198)]),console[_0x5b98f2(0x210)](window[_0x5b98f2(0x208)],window[_0x5b98f2(0x24b)],window['devicePixelRatio']);}[_0x27786b(0x1eb)](){const _0x27fb58=_0x27786b;let _0x38ae3a=_0xa7e7a();this[_0x27fb58(0x1c7)]['fill'](_0x4a12a5[_0x27fb58(0x1b5)],0x0,0x0,0x4,0x9,!0x0);for(let _0x5c2b6d=0x0;_0x5c2b6d<_0x38ae3a[_0x27fb58(0x1c3)];_0x5c2b6d++){let _0x30fdc1=_0x38ae3a[_0x5c2b6d],_0x2c9261=_0x30fdc1[_0x27fb58(0x232)](_0x27fb58(0x20a)),_0x184758=_0x30fdc1[_0x27fb58(0x232)](_0x27fb58(0x1d9));for(let _0x504937=0x0;_0x504937<_0x2c9261[_0x27fb58(0x1c3)];_0x504937++)for(let _0x5bf450=0x0;_0x5bf450<_0x2c9261[_0x504937]['length']-0x1;_0x5bf450++)this[_0x27fb58(0x1c7)][_0x27fb58(0x249)](_0x184758,0x1+_0x2c9261[_0x504937][_0x5bf450],0x6-_0x5c2b6d*0x3-_0x2c9261[_0x504937][_0x5bf450+0x1]+0x1,!0x1,_0x27fb58(0x19f));}}[_0x27786b(0x1de)](){const _0xe9ca09=_0x27786b;let _0x1f169e=_0x424fe6(),_0x209a4d=_0x1f169e[_0xe9ca09(0x232)](_0xe9ca09(0x20a)),_0x18d399=_0x1f169e[_0xe9ca09(0x232)]('tile');this[_0xe9ca09(0x248)][_0xe9ca09(0x1bc)](_0x4a12a5[_0xe9ca09(0x1b5)],0x0,0x0,0x4,0x2,!0x0);for(let _0x591673=0x0;_0x591673<_0x209a4d['length'];_0x591673++)for(let _0x551e48=0x0;_0x551e48<_0x209a4d[_0x591673][_0xe9ca09(0x1c3)]-0x1;_0x551e48++)this[_0xe9ca09(0x248)][_0xe9ca09(0x249)](_0x18d399,0x1+_0x209a4d[_0x591673][_0x551e48],0x1-_0x209a4d[_0x591673][_0x551e48+0x1],!0x1,_0xe9ca09(0x205));}[_0x27786b(0x231)](){const _0xa23cff=_0x27786b;for(this[_0xa23cff(0x198)]&&this[_0xa23cff(0x198)][_0xa23cff(0x203)](),this[_0xa23cff(0x226)]&&this[_0xa23cff(0x226)][_0xa23cff(0x203)](),this['activePiece']=_0x2e2235(this,0x4,0x13,this['gameScale']),this[_0xa23cff(0x226)]=_0x324b87(this,this[_0xa23cff(0x198)],this['gameScale']);_0x335913(this[_0xa23cff(0x1a9)],this[_0xa23cff(0x1f1)],this['gameScale'],this['ghostPiece'],[0x0,0x1]););this[_0xa23cff(0x1ce)](this[_0xa23cff(0x226)]),this[_0xa23cff(0x1eb)]();}[_0x27786b(0x1fd)](){const _0x2d7bc0=_0x27786b;for(this[_0x2d7bc0(0x22e)](this[_0x2d7bc0(0x226)]),this[_0x2d7bc0(0x226)][_0x2d7bc0(0x1d8)]('x',this['activePiece'][_0x2d7bc0(0x232)]('x')),this[_0x2d7bc0(0x226)]['setData']('y',this[_0x2d7bc0(0x198)]['getData']('y')),this['ghostPiece']['x']=this[_0x2d7bc0(0x1f1)][_0x2d7bc0(0x19a)](this[_0x2d7bc0(0x198)][_0x2d7bc0(0x232)]('x')),this[_0x2d7bc0(0x226)]['y']=this[_0x2d7bc0(0x1f1)][_0x2d7bc0(0x1cf)](0x13-this[_0x2d7bc0(0x198)]['getData']('y')),this[_0x2d7bc0(0x226)][_0x2d7bc0(0x1d8)](_0x2d7bc0(0x20a),_0x423aab(this[_0x2d7bc0(0x198)][_0x2d7bc0(0x232)]('cells'))),this[_0x2d7bc0(0x226)][_0x2d7bc0(0x1d8)]('rotationIndex',this[_0x2d7bc0(0x198)][_0x2d7bc0(0x232)](_0x2d7bc0(0x221)));_0x335913(this['graphics'],this[_0x2d7bc0(0x1f1)],this[_0x2d7bc0(0x1ad)],this[_0x2d7bc0(0x226)],[0x0,0x1]););this[_0x2d7bc0(0x1ce)](this['ghostPiece']);}[_0x27786b(0x24a)](_0xa077ae,_0x15885c){const _0x1aa33c=_0x27786b;this['gameOver']||(_0x463f50(this),this[_0x1aa33c(0x22c)]+=_0x15885c,this[_0x1aa33c(0x22c)]>0x3e8&&(this[_0x1aa33c(0x22c)]=0x0),this[_0x1aa33c(0x22c)]===0x0&&this[_0x1aa33c(0x198)]&&!DEBUG&&(this[_0x1aa33c(0x22e)](this[_0x1aa33c(0x198)]),_0x335913(this[_0x1aa33c(0x1a9)],this[_0x1aa33c(0x1f1)],this[_0x1aa33c(0x1ad)],this[_0x1aa33c(0x198)],[0x0,0x1])||(this[_0x1aa33c(0x1ce)](this['activePiece']),this[_0x1aa33c(0x187)](this[_0x1aa33c(0x198)]),this[_0x1aa33c(0x231)]()),this[_0x1aa33c(0x1ce)](this['activePiece'])));}},_0xb08287={'type':Phaser[_0x27786b(0x197)],'scale':{'mode':Phaser[_0x27786b(0x1ba)][_0x27786b(0x1e0)],'parent':_0x27786b(0x21d),'autoCenter':Phaser[_0x27786b(0x1ba)][_0x27786b(0x235)],'width':WIDTH,'height':HEIGHT},'width':WIDTH,'height':HEIGHT,'backgroundColor':'rgb(3,\x2023,\x2054)','scene':[_0x6c28cf]},_0x5e6ad7=new Phaser['Game'](_0xb08287);})()));function _0x336c(){const _0x11cda5=['checkFractions','lockTetromino','rotation','queueTiles','createGameMap','input','295794dtWnbI','image','load','preload','Tile\x20occupied','CYAN','streak','assets/Sprites/tetris.png','tilemap','rotateActivePiece','Geom','WEBGL','activePiece','ceil','tileToWorldX','activePointer','min','addTilesetImage','assets/Sprites/tetris_n.png','QueueLayer','2296611RpMEHM','addPointer','keyboard','clearHold','keys','pop','atlas','getBoundingBox','206RldfvF','graphics','star','start','keydown-ENTER','gameScale','cameras','sort','keydown-SPACE','Move\x20Data!!','toFixed','assets/particles/blocks.json','queueLayer','BOARD','keydown-P','rowClearParticles','keydown-DOWN','YELLOW','Scale','map_tiles','fill','level','ADD','keydown-Q','8lNMYRD','tweens','blue','length','Tetromino\x20bag:\x20','explode','740hICqdz','queueMap','setScale','getTileAt','BLUE','533788NytaHn','keydown-LEFT','4377690fyNWDV','setTetromino','tileToWorldY','createTileMaps','getTile','add','Queue:\x20','setTile','deltaX','moveActivePiece','from','setData','tile','Line','deltaY','rockLayer','abs','drawHold','layer','HEIGHT_CONTROLS_WIDTH','isFullscreen','Wall\x20kicks\x20being\x20evaluated:\x20','137355kwDFxr','displayWidth','Scene','keydown-ESC','addEmitZone','gameOver','max','isDown','drawQueue','Wall\x20kick\x20failure','color','centerY','GHOST','shake','map','Linear','Rectangle','keydown-E','create','cos','Jetris','make','assets/ui/fullscreen.png','adjustedBlockSize','scale','createQueueMap','updateGhost','Wall\x20kick\x20success','right','gameScaleY','setOrigin','keydown-UP','destroy','left','HoldLayer','down','assets/particles/streak.png','innerWidth','round','cells','11NNDHEf','block','flares','showRowClearFX','parse','log','createBlankLayer','strokeRectShape','Bug:\x20','green','push','setAmbientColor','enable','scene','clear','displayHeight','lineStyle','startFullscreen','jetris','ORANGE','resume','hold','rotationIndex','GameLayer','floor','index','random','ghostPiece','1273468YeoBPo','trail','centerX','Testing\x20move:\x20','width','elapsed','Light2D','clearTetromino','setTint','Spawned\x20tetromino:\x20','spawn','getData','drawDropAnimation','center','CENTER_BOTH','pointerup','addFullScreenToggle','RED','spritesheet','container','assets/particles/blocks.png','lights','removeTileAt','particles','drop','alpha','setFrame','bug:\x20','createHoldMap','type','assets/particles/trail.png','unshift','wallKicks','holdMap','putTileAt','update','innerHeight','GhostLayer','25XxnBLZ','fullscreen','tiles','purple','ghostLayer','SetTetromino:\x20','queue_tiles','assets/particles/star.png','GREEN','yellow','JLOSTZ'];_0x336c=function(){return _0x11cda5;};return _0x336c();}