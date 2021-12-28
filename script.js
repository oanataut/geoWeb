//Imports
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
import { FirstPersonControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/FirstPersonControls.js';

import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/libs/stats.module.js';
import { LightProbeGenerator } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/lights/LightProbeGenerator.js';

//Declare Variables
let camera, controls, scene, renderer, stats, clock;

let ground, groundgeometry, groundmaterial, galerymaterial, galerymaterialsh, probemat;

let alight, dlight, plight;
//const raycaster;

const model = 'archimorph.3dm'

const worldWidth = 128, worldDepth = 128;

//Call functions
init();
animate();

//Initialize scene
function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.z = 50;
    camera.position.y = 1;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xaaccff );
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.0025);

    groundgeometry = new THREE.PlaneGeometry( 2000, 2000 );
    groundgeometry.rotateX( - Math.PI / 2 );

    //const position = geometry.attributes.position;
   // position.usage = THREE.DynamicDrawUsage;

    //Create Skybox texture
    let skymat = [];
        let texture_ft = new THREE.TextureLoader().load( 'blizzard_ft.jpg');
        let texture_bk = new THREE.TextureLoader().load( 'blizzard_bk.jpg');
        let texture_up = new THREE.TextureLoader().load( 'blizzard_up.jpg');
        let texture_dn = new THREE.TextureLoader().load( 'blizzard_dn.jpg');
        let texture_rt = new THREE.TextureLoader().load( 'blizzard_rt.jpg');
        let texture_lf = new THREE.TextureLoader().load( 'blizzard_lf.jpg');
          
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_up }));
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
        skymat.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
        for (let i = 0; i < 6; i++)
           skymat[i].side = THREE.BackSide;
    let skyboxGeo = new THREE.BoxGeometry( 1000, 500, 1000);
    let skybox = new THREE.Mesh( skyboxGeo, skymat );
    skybox.position.y = 200;
    scene.add( skybox );

    //const texture = new THREE.TextureLoader().load( 'textures/water.jpg' );
    //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat.set( 5, 5 );
    groundmaterial = new THREE.MeshBasicMaterial( { color: 0x33ffffff, map: texture_dn } );
    groundgeometry.castShadow = false;
    groundgeometry.receiveShadow=true;
    galerymaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.1, metalness: 0.3, side: THREE.DoubleSide } ); //THREE.MeshBasicMaterial( { color: 0xd8d5db} );
    galerymaterialsh = new THREE.ShadowMaterial();
    galerymaterialsh.opacity = 0.2;

    ground = new THREE.Mesh( groundgeometry, groundmaterial );
    ground.position.z +10;
    scene.add( ground );

    // load the model
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

    loader.load( model, function ( object ) {

        object.traverse( function (child) { 
            if (child.isMesh) {
                child.material = galerymaterial
                child.castShadow = true; 
                child.receiveShadow = true;
            }
         }, false)

        // uncomment to hide spinner when model loads
        document.getElementById('loader').remove()
        scene.add( object )

    } )
    

    //skymat.encoding = THREE.sRGBEncoding;
    //alight = new THREE.LightProbe(); 
        //alight.copy (LightProbeGenerator.fromCubeTexture(probemat);
    alight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.5); //hemisphere light
    dlight = new THREE.DirectionalLight( 0x404040, 2);
    plight = new THREE.SpotLight(0x323edd, 0.5);
    plight.decay = 2;
    plight.position.set(-50, 100, -50)
    plight.castShadow = true; 
    plight.shadow.bias = -0.0001;

    scene.add( alight, dlight, plight);
    dlight.shadow.bias = -0.001;
    //dlight.shadow.mapSize.width = 1024*4;
    //dlight.shadow.mapSize.height = 1024*4;

    dlight.position.set(-500,500,50);
    dlight.castShadow = true;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    controls = new FirstPersonControls( camera, renderer.domElement );

    controls.movementSpeed = 10;
    controls.lookSpeed = 0.03;

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //

    //window.addEventListener( 'resize', onWindowResize );

}


//Define User functionality


//Update
function animate() {

    requestAnimationFrame( animate );
    controls.update( clock.getDelta() );
    dlight.position.set( 
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10,
     );
    renderer.render( scene, camera )

}