/**
 * Created by JoséJuan on 09/01/2016.
 */
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function loadStacks(axis) {
    var brain_stacks = [];
    var loader = new THREE.TextureLoader();
    for (var i = 1; i <= 256; i++){
        brain_stacks.push(loader.load(axis + '_stack/slice_' + pad(i, 3) + '.png'));
    }
    return brain_stacks

}

var axial = loadStacks('axial');
var coronal = loadStacks('coronal');
var sagittal = loadStacks('sagittal');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer( {alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
container = document.getElementById('brain');
container.appendChild( renderer.domElement );

controls1 = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
controls1.enableDamping = true;
controls1.dampingFactor = 0.25;
controls1.enableZoom = true;


var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[0].position.set( 0, 200, 0 );
lights[1].position.set( 100, 200, 100 );
lights[2].position.set( -100, -200, -100 );

scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );

var gui = new dat.GUI({
    height : 3 * 32 - 1,
    autoplace: false
});
gui.domElement.id = 'gui';

var slice = new function(){
    this.Sagittal = 128;
    this.Axial = 128;
    this.Coronal = 128;
    this.Reset = function (){return this.Sagittal = 128, this.Axial = 128,this.Coronal = 128, camera.position.z = 500}
};

gui.add(slice, 'Sagittal',1,256).step(1).listen();
gui.add(slice, 'Axial',1,256).step(1).listen();
gui.add(slice, 'Coronal',1,256).step(1).listen();
gui.add(slice, 'Reset');

planeGroup = new THREE.Object3D;
var geometry = new THREE.PlaneGeometry( 256, 256);
var material1 = new THREE.MeshBasicMaterial({
    color: 0x156289,
    side: THREE.DoubleSide
});
var material2 = new THREE.MeshBasicMaterial({
    color: 0x156289,
    side: THREE.DoubleSide
});
var material3 = new THREE.MeshBasicMaterial({
    color: 0x156289,
    side: THREE.DoubleSide
});
var plane1 = new THREE.Mesh( geometry, material1 );
planeGroup.add( plane1 );
plane1.material.map = coronal[128];

var plane2 = new THREE.Mesh( geometry, material2 );
planeGroup.add( plane2 );
plane2.material.map = axial[128];

var plane3 = new THREE.Mesh( geometry, material3 );
planeGroup.add( plane3 );
plane3.material.map = sagittal[128];


plane2.rotation.x = -Math.PI / 2;
plane3.rotation.y = -Math.PI / 2;

scene.add(planeGroup);

planeGroup.rotation.y = 30;

camera.position.z = 500;



var render = function () {
    requestAnimationFrame( render );
    plane1.position.z = slice.Coronal-128;
    plane2.position.y = slice.Axial-128;
    plane3.position.x = slice.Sagittal-128;
    plane1.material.map = coronal[slice.Coronal-1];
    plane2.material.map = axial[slice.Axial-1];
    plane3.material.map = sagittal[slice.Sagittal-1];


    function animate() {

        requestAnimationFrame( animate );

        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

        stats.update();

        render();

    }

    renderer.render(scene, camera);
};

render();