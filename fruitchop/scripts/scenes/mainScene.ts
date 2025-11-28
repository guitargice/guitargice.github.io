import { Scene3D } from '@enable3d/phaser-extension'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { Mesh, Object3D, Object3DEventMap } from 'three'
import * as THREE from 'three'

interface FruitData {
  instancedMesh: THREE.InstancedMesh
  instanceId: number
  modelName: string // Track which model this is
  letter: string
  sprite: THREE.Sprite
  spawnTime: number
  isActive: boolean
  position: THREE.Vector3
  rotation: THREE.Euler
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
  matrix: THREE.Matrix4
  velocity: THREE.Vector3
  angularVelocity: THREE.Vector3
  color: number
  spriteOffset: number // Offset to center the sprite on the model
  isBomb?: boolean // Flag to identify bombs
  flintLight?: THREE.PointLight // Flickering light for bomb flint
  flintParticles?: THREE.Mesh[] // 3D sparkler particles
  fuseSound?: Phaser.Sound.BaseSound // Looping fuse sound for bomb
  scoreCountdown: number // Countdown from 2000 to 500, value added to score when chopped
}

interface CutPieceData {
  instancedMesh: THREE.InstancedMesh
  instanceId: number
  modelName: string // Track which model this cut piece is from
  originalFruitModelName: string
  position: THREE.Vector3
  rotation: THREE.Euler
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
  matrix: THREE.Matrix4
  velocity: THREE.Vector3
  angularVelocity: THREE.Vector3
  isActive: boolean
}

export default class MainScene extends Scene3D {
  private score: number = 0
  private lives: number = 3
  private fruits: FruitData[] = []
  private cutPieces: CutPieceData[] = []
  private availableLetters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
  private isInitialized: boolean = false
  private wallCanvas: HTMLCanvasElement | null = null
  private wallCanvasContext: CanvasRenderingContext2D | null = null
  private wallTexture: THREE.CanvasTexture | null = null
  private wallNormalCanvas: HTMLCanvasElement | null = null
  private wallNormalCanvasContext: CanvasRenderingContext2D | null = null
  private wallNormalTexture: THREE.CanvasTexture | null = null
  private wallMesh: THREE.Mesh | null = null
  private splatTextures: HTMLImageElement[] = []
  private blastTexture: HTMLImageElement | null = null
  private blastNormalTexture: HTMLImageElement | null = null
  private prerenderedSplats: Map<string, HTMLCanvasElement> = new Map()
  private pendingTextureUpdate: boolean = false
  private pendingNormalTextureUpdate: boolean = false
  
  private fruitModels: Map<string, { geometry: THREE.BufferGeometry, material: THREE.Material }> = new Map()
  private instancedMeshes: Map<string, THREE.InstancedMesh> = new Map()
  private cutPieceInstancedMeshes: Map<string, THREE.InstancedMesh> = new Map()
  private nextInstanceId: Map<string, number> = new Map()
  private nextCutPieceInstanceId: Map<string, number> = new Map()
  private freeInstanceIds: Map<string, number[]> = new Map()
  private freeCutPieceInstanceIds: Map<string, number[]> = new Map()
  private maxInstancesPerModel: number = 100
  private lastSpawnTime: number = -10000 // Initialize to allow immediate first spawn
  
  // Banana Bonanza mode
  private bananaBonanzaActive: boolean = false
  private bananaBonanzaText?: Phaser.GameObjects.Text
  private bananaBonanzaCount: number = 0
  private bananaBonanzaTimer?: Phaser.Time.TimerEvent
  private nextBonanzaTime: number = 60000 // First bonanza at 60 seconds
  
  private fruitModelNames: string[] = [
    'SM_AppleGreen',
    'SM_Avocado',
    'SM_Banana',
    'SM_CherryA',
    'SM_Coconut',
    'SM_CherryB',
    'SM_CherryC',
    'SM_Fig',
    'SM_Kiwi',
    'SM_Lemon',
    'SM_Lime',
    'SM_Mango',
    'SM_Papaya',
    'SM_Peach',
    'SM_PearYellow',
    'SM_Pineapple',
    'SM_Plum',
    'SM_Pomegranate',
    'SM_StarFruit',
    'SM_StrawberryA',
    'bomb'  // Add bomb model
  ]
  
  // Models for special effects (not spawnable as targets)
  private effectModelNames: string[] = [
    'SM_AppleGreenCutA',
    'SM_AppleGreenCutB',
    'SM_AvocadoCutA',
    'SM_AvocadoCutB',
    'SM_BananaCutA',
    'SM_BananaCutB',
    'SM_CherryACutA',
    'SM_CherryACutB',
    'SM_CherryCCutA',
    'SM_CherryCCutB',
    'SM_CoconutBottom',
    'SM_CoconutTop',
    'SM_FigCutA',
    'SM_FigCutB',
    'SM_KiwiCutBottom',
    'SM_KiwiCutTop',
    'SM_LemonCutBottom',
    'SM_LemonCutTop',
    'SM_LimeCutBottom',
    'SM_LimeCutTop',
    'SM_PapayaCutA',
    'SM_PapayaCutB',
    'SM_PeachCutA',
    'SM_PeachCutB',
    'SM_PineappleCutBottom',
    'SM_PineappleCutTop',
    'SM_PlumCutA',
    'SM_PlumCutB',
    'SM_PomegranateCutA',
    'SM_PomegranateCutB',
    'SM_StarFruitCutA',
    'SM_StarFruitCutB',
    'SM_StrawberryCutA',
    'SM_StrawberryCutB'
  ]
  
  // Map fruits to their cut piece model names
  private fruitCutModels: Map<string, { left: string, right: string }> = new Map([
    ['SM_AppleGreen', { left: 'SM_AppleGreenCutA', right: 'SM_AppleGreenCutB' }],
    ['SM_Avocado', { left: 'SM_AvocadoCutA', right: 'SM_AvocadoCutB' }],
    ['SM_Banana', { left: 'SM_BananaCutA', right: 'SM_BananaCutB' }],
    ['SM_CherryA', { left: 'SM_CherryACutA', right: 'SM_CherryACutB' }],
    ['SM_CherryC', { left: 'SM_CherryCCutA', right: 'SM_CherryCCutB' }],
    ['SM_Coconut', { left: 'SM_CoconutTop', right: 'SM_CoconutBottom' }],
    ['SM_Fig', { left: 'SM_FigCutA', right: 'SM_FigCutB' }],
    ['SM_Kiwi', { left: 'SM_KiwiCutBottom', right: 'SM_KiwiCutTop' }],
    ['SM_Lemon', { left: 'SM_LemonCutTop', right: 'SM_LemonCutBottom' }],
    ['SM_Lime', { left: 'SM_LimeCutTop', right: 'SM_LimeCutBottom' }],
    ['SM_Papaya', { left: 'SM_PapayaCutA', right: 'SM_PapayaCutB' }],
    ['SM_Peach', { left: 'SM_PeachCutA', right: 'SM_PeachCutB' }],
    ['SM_Pineapple', { left: 'SM_PineappleCutBottom', right: 'SM_PineappleCutTop' }],
    ['SM_Plum', { left: 'SM_PlumCutA', right: 'SM_PlumCutB' }],
    ['SM_Pomegranate', { left: 'SM_PomegranateCutA', right: 'SM_PomegranateCutB' }],
    ['SM_StarFruit', { left: 'SM_StarFruitCutA', right: 'SM_StarFruitCutB' }],
    ['SM_StrawberryA', { left: 'SM_StrawberryCutA', right: 'SM_StrawberryCutB' }]
  ])
  private modelsLoaded: number = 0
  private letterMaterials: Map<string, THREE.SpriteMaterial> = new Map()
  private isGameOverFlag: boolean = false
  
  private scoreText: Phaser.GameObjects.Text | null = null
  private livesText: Phaser.GameObjects.Text | null = null
  private lettersText: Phaser.GameObjects.Text | null = null

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.accessThirdDimension()
    
    // Reset game state
    this.resetGame()
    
    // Preload letter materials
    this.preloadLetterMaterials()
  }
  
  preloadLetterMaterials() {
    if (this.letterMaterials.size > 0) return // Already loaded
    
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
    
    letters.forEach(letter => {
      const canvas = document.createElement('canvas')
      // ... (canvas drawing code remains same) ...
      const context = canvas.getContext('2d')!
      canvas.width = 256
      canvas.height = 256
      
      // Draw rounded rectangle with blue border (reduced padding)
      const radius = 20  // Smaller radius
      const x = 40  // More inset (was 20)
      const y = 40  // More inset (was 20)
      const width = 176  // Smaller (was 216)
      const height = 176  // Smaller (was 216)
      
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw rounded rectangle background (solid white)
      context.fillStyle = '#ffffff'
      context.beginPath()
      context.moveTo(x + radius, y)
      context.lineTo(x + width - radius, y)
      context.quadraticCurveTo(x + width, y, x + width, y + radius)
      context.lineTo(x + width, y + height - radius)
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      context.lineTo(x + radius, y + height)
      context.quadraticCurveTo(x, y + height, x, y + height - radius)
      context.lineTo(x, y + radius)
      context.quadraticCurveTo(x, y, x + radius, y)
      context.closePath()
      context.fill()
      
      // Draw blue border
      context.strokeStyle = '#0000ff'
      context.lineWidth = 8
      context.stroke()
      
      // Draw letter (black text)
      context.fillStyle = '#000000'
      context.font = 'bold 120px Arial'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(letter.toUpperCase(), 128, 128)
      
      const texture = new THREE.CanvasTexture(canvas)
      
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 1.0  // No transparency
      })
      
      this.letterMaterials.set(letter, material)
    })
  }

  create() {
    
    // Show loading text while models load
    const loadingText = this.add.text(640, 350, 'Loading...', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // Create progress bar background
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(320, 410, 640, 30)
    
    // Create progress bar
    const progressBar = this.add.graphics()
    
    const updateProgress = (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(330, 420, 620 * value, 10)
    }
    
    
    // Setup scene
    this.third.warpSpeed('-ground', '-orbitControls', '-light')
    this.third.physics.setGravity(0, 0, 0) // No gravity - we'll handle motion manually
    
    // Add lighting - Brighter setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 12.0)
    this.third.scene.add(ambientLight)
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3)
    directionalLight1.position.set(1, -4, 1)
    directionalLight1.castShadow = true
    directionalLight1.shadow.mapSize.width = 2048
    directionalLight1.shadow.mapSize.height = 2048
    directionalLight1.shadow.camera.left = -50
    directionalLight1.shadow.camera.right = 50
    directionalLight1.shadow.camera.top = 50
    directionalLight1.shadow.camera.bottom = -50
    this.third.scene.add(directionalLight1)

    
    
    // Enable shadows in renderer
    this.third.renderer.shadowMap.enabled = true
    this.third.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Camera setup - looking horizontally from behind
    this.third.camera.position.set(0, -30, 0)
    this.third.camera.lookAt(0, 0, 0)
    
    // Disable physics - we'll use manual motion
    // this.third.physics.setGravity(0, 0, -20)
    
    // Load splat textures and pre-render all color variations
    let loadedCount = 0
    const splatImages = ['assets/img/splat.png', 'assets/img/splat2.png']
    
    // Load blast texture separately
    const blastImg = new Image()
    blastImg.src = 'assets/img/blast.png'
    blastImg.onload = () => {
      this.blastTexture = blastImg
      console.log('Blast texture loaded!')
    }
    
    // Load blast normal map
    const blastNormalImg = new Image()
    blastNormalImg.src = 'assets/img/blast_n.png'
    blastNormalImg.onload = () => {
      this.blastNormalTexture = blastNormalImg
      console.log('Blast normal texture loaded!')
    }
    
    const preRenderAllSplats = () => {
      console.log('Pre-rendering all splat color variations...')
      
      // Get all unique fruit colors
      const fruitColors = Array.from(new Set(this.fruitModelNames.map(name => this.getFruitColor(name))))
      
      this.splatTextures.forEach((splatImg, splatIdx) => {
        fruitColors.forEach(color => {
          const key = `${splatIdx}_${color}`
          
          // Create offscreen canvas for this color variation
          const canvas = document.createElement('canvas')
          canvas.width = splatImg.width
          canvas.height = splatImg.height
          const ctx = canvas.getContext('2d', { willReadFrequently: false })!
          
          const r = (color >> 16) & 0xFF
          const g = (color >> 8) & 0xFF
          const b = color & 0xFF
          
          // Draw colored rectangle
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Use destination-in to only keep colored pixels where splat is opaque
          ctx.globalCompositeOperation = 'destination-in'
          ctx.drawImage(splatImg, 0, 0)
          
          this.prerenderedSplats.set(key, canvas)
        })
      })
      
      console.log(`Pre-rendered ${this.prerenderedSplats.size} splat variations!`)
    }
    
    splatImages.forEach((src, idx) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        this.splatTextures.push(img)
        loadedCount++
        if (loadedCount === splatImages.length) {
          preRenderAllSplats()
        }
      }
    })
    
    // Load wall.fbx model as background
    const wallLoader = new FBXLoader()
    const textureLoader = new THREE.TextureLoader()
    
    wallLoader.load(
      'assets/models/wall.fbx',
      (object) => {
        console.log('Wall FBX loaded!')
        
        object.traverse((child: Object3D<Object3DEventMap>) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh
            console.log('Found wall mesh:', mesh)
            console.log('Wall material:', mesh.material)
            
            mesh.receiveShadow = true
            mesh.castShadow = false
            
            // Store reference to wall mesh
            this.wallMesh = mesh
            
            // Load wall textures manually
            const wallMaterial = mesh.material as any
            
            // Load the color texture
            textureLoader.load('assets/img/wall.png', (texture) => {
              console.log('Wall color texture loaded!')
              texture.colorSpace = THREE.SRGBColorSpace
              texture.rotation = Math.PI / 2  // Rotate 90 degrees
              texture.center.set(0.5, 0.5)  // Rotate around center
              texture.needsUpdate = true
              wallMaterial.map = texture
              wallMaterial.needsUpdate = true
              
              // Now setup canvas texture with the loaded texture
              this.setupWallCanvasTexture(wallMaterial)
            })
            
            // Load the normal map
            textureLoader.load('assets/img/wall_n.png', (texture) => {
              console.log('Wall normal texture loaded!')
              texture.rotation = Math.PI / 2  // Rotate 90 degrees
              texture.center.set(0.5, 0.5)  // Rotate around center
              texture.needsUpdate = true
              wallMaterial.normalMap = texture
              wallMaterial.needsUpdate = true
              
              // Setup normal canvas AFTER normal map is loaded
              this.setupWallNormalCanvas(wallMaterial)
            })
          }
        })
        
        // Position and scale the wall at origin
        object.position.set(0, 0, 0)
        object.rotation.z = -Math.PI / 2  // Rotate -90 degrees around Z
        object.scale.setScalar(1)
        
        this.third.scene.add(object)
      },
      undefined,
      (error) => {
        console.error('Error loading wall.fbx:', error)
      }
    )
  
    // Setup input
    this.setupInput()
    
    // Load all fruit models (only if not already loaded)
    if (this.fruitModels.size === 0) {
      const loader = new FBXLoader()
      
      // Combine regular fruit models and effect models for loading
      const allModelNames = [...this.fruitModelNames, ...this.effectModelNames]
      
      // First pass: load all models
      const loadedGeometries = new Map<string, { geometry: THREE.BufferGeometry, material: THREE.Material }>()
      
      allModelNames.forEach((modelName) => {
        loader.load(
          `assets/models/${modelName}.fbx`,
          (object) => {
            let geometry: THREE.BufferGeometry | null = null
            let material: THREE.Material | null = null
            
            object.traverse((child: Object3D<Object3DEventMap>) => {
              if ((child as Mesh).isMesh && !geometry) {
                const mesh = child as Mesh
                geometry = mesh.geometry.clone()
                const originalMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
                
                // Use the original material with ALL its maps and fix color space
                if (originalMaterial instanceof THREE.MeshStandardMaterial) {
                  const newMaterial = originalMaterial.clone()
                  
                  // Fix color space for ALL color textures
                  if (newMaterial.map) {
                    newMaterial.map.colorSpace = THREE.SRGBColorSpace
                    newMaterial.map.needsUpdate = true
                  }
                  
                  // AO map also needs SRGB color space
                  if (newMaterial.aoMap) {
                    newMaterial.aoMap.colorSpace = THREE.SRGBColorSpace
                    newMaterial.aoMap.needsUpdate = true
                  }
                  
                  // Emissive map if it exists
                  if (newMaterial.emissiveMap) {
                    newMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace
                    newMaterial.emissiveMap.needsUpdate = true
                  }
                  
                  // Make sure material updates
                  newMaterial.needsUpdate = true
                  
                  material = newMaterial
                } else {
                  material = originalMaterial
                }
              }
            })
            
            if (geometry && material) {
              loadedGeometries.set(modelName, { geometry, material })
              this.modelsLoaded++
              
              // Update progress (models are 50% of loading)
              const modelProgress = (this.modelsLoaded / allModelNames.length) * 0.5
              updateProgress(modelProgress)
              
              // When all models are loaded, apply centering transforms
              if (this.modelsLoaded === allModelNames.length) {
                // Second pass: calculate and apply centering transforms
                this.fruitModelNames.forEach(fruitModelName => {
                  const fruitData = loadedGeometries.get(fruitModelName)
                  if (!fruitData) return
                  
                  // Calculate centering transform from the fruit model
                  fruitData.geometry.computeBoundingBox()
                  const bbox = fruitData.geometry.boundingBox!
                  const center = new THREE.Vector3()
                  bbox.getCenter(center)
                  
                  // Apply transform to fruit model
                  fruitData.geometry.translate(-center.x, -center.y, -center.z)
                  this.fruitModels.set(fruitModelName, fruitData)
                  
                  // Apply SAME transform to both cut pieces if they exist
                  const cutModels = this.fruitCutModels.get(fruitModelName)
                  if (cutModels) {
                    const leftCutData = loadedGeometries.get(cutModels.left)
                    if (leftCutData) {
                      leftCutData.geometry.translate(-center.x, -center.y, -center.z)
                      this.fruitModels.set(cutModels.left, leftCutData)
                    }
                    
                    const rightCutData = loadedGeometries.get(cutModels.right)
                    if (rightCutData) {
                      rightCutData.geometry.translate(-center.x, -center.y, -center.z)
                      this.fruitModels.set(cutModels.right, rightCutData)
                    }
                  }
                })
                
                // Handle effect models that don't have a parent fruit (if any)
                this.effectModelNames.forEach(effectModelName => {
                  if (!this.fruitModels.has(effectModelName)) {
                    const effectData = loadedGeometries.get(effectModelName)
                    if (effectData) {
                      this.fruitModels.set(effectModelName, effectData)
                    }
                  }
                })
                
                // Use nextTick to allow loading text to render before heavy initialization
                this.time.delayedCall(50, async () => {
                  loadingText.setText('Initializing...')
                  
                  // Initialize pool with progress updates
                  await this.initializeFruitPoolWithProgress((poolProgress) => {
                    updateProgress(0.5 + poolProgress * 0.5)
                  })
                  
                  loadingText.destroy()
                  progressBar.destroy()
                  progressBox.destroy()
                  this.createUI()
                  this.isInitialized = true
                  this.spawnFruit()
                })
              }
            }
          },
          undefined,
          (error) => {
            // Silently fail
          }
        )
      })
    } else {
      // Models already loaded, initialize pool and start spawning
      updateProgress(0.5)
      this.time.delayedCall(50, async () => {
        loadingText.setText('Initializing...')
        
        // Initialize pool with progress updates
        await this.initializeFruitPoolWithProgress((poolProgress) => {
          updateProgress(0.5 + poolProgress * 0.5)
        })
        
        loadingText.destroy()
        progressBar.destroy()
        progressBox.destroy()
        this.createUI()
        this.isInitialized = true
        this.spawnFruit()
      })
    }
  }
  
  getFruitColor(modelName: string): number {
    // Map fruit model names to their representative colors
    const colorMap: { [key: string]: number } = {
      'SM_AppleRed': 0xff0000,      // Red
      'SM_AppleGreen': 0x00ff00,    // Green
      'SM_Avocado': 0x568203,       // Dark green
      'SM_Banana': 0xffff00,        // Yellow
      'SM_CherryA': 0xff0000,       // Red
      'SM_CherryB': 0xff0000,       // Red
      'SM_CherryC': 0xff0000,       // Red
      'SM_Coconut': 0x8b4513,       // Brown
      'SM_Fig': 0x800080,           // Purple
      'SM_HoneydewMelon': 0x90ee90, // Light green
      'SM_Kiwi': 0x8db600,          // Yellow-green
      'SM_Lemon': 0xffff00,         // Yellow
      'SM_Lime': 0x00ff00,          // Green
      'SM_Mango': 0xffa500,         // Orange
      'SM_Papaya': 0xff6347,        // Tomato/coral
      'SM_Peach': 0xffb07c,         // Peach
      'SM_PearYellow': 0xffff00,    // Yellow
      'SM_Pineapple': 0xffdd00,     // Golden yellow
      'SM_Plum': 0x8b008b,          // Dark magenta
      'SM_Pomegranate': 0xdc143c,   // Crimson
      'SM_StarFruit': 0xffff99,     // Light yellow
      'SM_StrawberryA': 0xff0000,   // Red
      'bomb': 0x000000              // Black for bomb
    }
    return colorMap[modelName] || 0xff0000 // Default to red
  }

  async initializeFruitPoolWithProgress(onProgress: (progress: number) => void) {
    if (this.instancedMeshes.size > 0) return // Already initialized
    
    console.log('Initializing instanced meshes...')
    const poolStart = performance.now()
    
    let progress = 0
    const totalModels = this.fruitModelNames.length + this.effectModelNames.length
    
    // Create ONE InstancedMesh per fruit model type
    for (const modelName of this.fruitModelNames) {
      const model = this.fruitModels.get(modelName)
      if (!model) continue
      
      // Create instanced mesh that CAN hold up to maxInstancesPerModel instances
      const instancedMesh = new THREE.InstancedMesh(
        model.geometry,
        model.material,
        this.maxInstancesPerModel
      )
      instancedMesh.castShadow = true
      instancedMesh.receiveShadow = false
      instancedMesh.frustumCulled = false
      instancedMesh.count = 0 // Start with 0 active instances
      
      this.third.scene.add(instancedMesh)
      this.instancedMeshes.set(modelName, instancedMesh)
      this.nextInstanceId.set(modelName, 0)
      this.freeInstanceIds.set(modelName, [])
      
      progress++
      onProgress(progress / totalModels)
      
      if (progress % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
    
    console.log(`Instanced meshes initialized: ${this.instancedMeshes.size} fruit types`)
    
    // Create ONE InstancedMesh per cut piece model type
    for (const modelName of this.effectModelNames) {
      const model = this.fruitModels.get(modelName)
      if (!model) continue
      
      const instancedMesh = new THREE.InstancedMesh(
        model.geometry,
        model.material,
        this.maxInstancesPerModel
      )
      instancedMesh.castShadow = true
      instancedMesh.receiveShadow = false
      instancedMesh.frustumCulled = false
      instancedMesh.count = 0
      
      this.third.scene.add(instancedMesh)
      this.cutPieceInstancedMeshes.set(modelName, instancedMesh)
      this.nextCutPieceInstanceId.set(modelName, 0)
      this.freeCutPieceInstanceIds.set(modelName, [])
      
      progress++
      onProgress(progress / totalModels)
      
      if (progress % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
    
    console.log(`Cut piece instanced meshes initialized: ${this.cutPieceInstancedMeshes.size} types`)
    
    // --- WARM UP PHASE ---
  }

  resetGame() {
    this.isGameOverFlag = false
    this.score = 0
    this.lives = 5
    
    // Update UI
    if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`)
    if (this.livesText) this.livesText.setText(`❤️ Lives: ${this.lives}`)
    if (this.lettersText) this.lettersText.setText('')
    
    // Deactivate all fruits (hide them)
    this.fruits.forEach(f => {
      f.isActive = false
      // Hide instance by moving off-screen
      const hideMatrix = new THREE.Matrix4().setPosition(0, -500, 0)
      f.instancedMesh.setMatrixAt(f.instanceId, hideMatrix)
      f.instancedMesh.instanceMatrix.needsUpdate = true
      f.sprite.position.set(0, -500, 0)
    })
    this.fruits = []
    this.fruits = [] // Clear active list
    
    // Reset spawn timer
    this.lastSpawnTime = this.time.now
    
    // Reset Banana Bonanza
    this.bananaBonanzaActive = false
    this.bananaBonanzaCount = 0
    this.nextBonanzaTime = this.time.now + 60000
    if (this.bananaBonanzaText) {
      this.bananaBonanzaText.setVisible(false)
    }
    if (this.bananaBonanzaTimer) {
      this.bananaBonanzaTimer.remove()
      this.bananaBonanzaTimer = undefined
    }
    
    // Remove Game Over UI
    const uiElements = this.children.list.filter((child: any) => child.name === 'gameOverUI')
    uiElements.forEach(child => child.destroy())
    
    // Restart spawning (minimum 1 second delay)
    this.time.delayedCall(1000, () => this.spawnFruit())
  }

  createUI() {
    // Black background for header
    this.add.rectangle(640, 50, 1280, 100, 0x000000, 0.7)
    
    // Title
    this.add.text(640, 30, 'Fruit Chop 🍎 - Type to Slice!', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // Score
    this.scoreText = this.add.text(100, 70, `Score: ${this.score}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffff00'
    }).setOrigin(0.5)

    // Lives
    this.livesText = this.add.text(1180, 70, `❤️ Lives: ${this.lives}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ff0000'
    }).setOrigin(0.5)
    
    // Letters display at bottom
    this.lettersText = this.add.text(640, 650, '', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // Banana Bonanza text (initially hidden)
    this.bananaBonanzaText = this.add.text(640, 400, '🍌 BANANA BONANZA! 🍌', {
      fontSize: '72px',
      fontFamily: 'Arial',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#ff6600',
      strokeThickness: 6
    }).setOrigin(0.5).setVisible(false)
    
    // Back button
    const backBtn = this.add.rectangle(100, 750, 150, 50, 0x4a4a8a)
      .setStrokeStyle(2, 0x6a6aff)
      .setInteractive({ useHandCursor: true })
    
    const backText = this.add.text(100, 750, 'Back', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    backBtn.on('pointerover', () => backBtn.setFillStyle(0x6a6aff))
    backBtn.on('pointerout', () => backBtn.setFillStyle(0x4a4a8a))
    backBtn.on('pointerdown', () => this.scene.start('PreloadScene'))
  }

  setupInput() {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      
      if (key.length !== 1) return
      
      // Find fruit with matching letter
      const matchingFruit = this.fruits.find(f => f.isActive && f.letter === key)
      
      if (matchingFruit) {
        this.chopFruit(matchingFruit)
      } else {
        // Play miss sound when key doesn't match any fruit
        this.sound.play('miss', { volume: 0.5 })
      }
    })
  }

  spawnFruit() {
    if (!this.isInitialized || this.lives <= 0) {
      return
    }
    
    // Don't spawn regular fruits during Banana Bonanza, just return (bonanza will restart spawning when done)
    if (this.bananaBonanzaActive) {
      return
    }
    
    // Enforce minimum 1 second between spawns
    const timeSinceLastSpawn = this.time.now - this.lastSpawnTime
    if (timeSinceLastSpawn < 1000) {
      // Too soon, reschedule for later
      const remainingTime = 1000 - timeSinceLastSpawn
      this.time.delayedCall(remainingTime, () => this.spawnFruit())
      return
    }
    
    // Get letters already in use
    const usedLetters = this.fruits.filter(f => f.isActive).map(f => f.letter)
    const availableLetters = this.availableLetters.filter(l => !usedLetters.includes(l))
    
    if (availableLetters.length === 0) {
      // No letters available, try again later
      const delay = Phaser.Math.Between(1000, 2000)
      this.time.delayedCall(delay, () => this.spawnFruit())
      return
    }
    
    // Count active bombs
    const activeBombs = this.fruits.filter(f => f.isActive && f.isBomb).length
    
    // 20% chance to spawn a bomb, but only if no bombs are active
    let spawnBomb = false
    if (activeBombs < 1) {
      spawnBomb = Math.random() < 0.2
    }
    
    // Choose model type
    let modelName: string
    if (spawnBomb) {
      modelName = 'bomb'
    } else {
      modelName = Phaser.Utils.Array.GetRandom([
        'SM_AppleGreen',
        'SM_Avocado',
        'SM_Banana',
        'SM_CherryA',
        'SM_CherryC',
        'SM_Fig',
        'SM_Kiwi',
        'SM_Lemon',
        'SM_Papaya',
        'SM_Peach',
        'SM_Pineapple',
        'SM_Plum',
        'SM_Pomegranate',
        'SM_StarFruit',
        'SM_StrawberryA'
      ])
    }
    
    // Get instanced mesh for this model
    const instancedMesh = this.instancedMeshes.get(modelName)
    if (!instancedMesh) {
      console.warn(`No instanced mesh for ${modelName}`)
      const delay = Phaser.Math.Between(1000, 2000)
      this.time.delayedCall(delay, () => this.spawnFruit())
      return
    }
    
    // Get instance ID (reuse freed slot or get next available)
    const freeIds = this.freeInstanceIds.get(modelName)!
    let instanceId: number
    if (freeIds.length > 0) {
      instanceId = freeIds.pop()!
    } else {
      instanceId = this.nextInstanceId.get(modelName)!
      this.nextInstanceId.set(modelName, instanceId + 1)
    }
    
    // Check if we've exceeded max instances
    if (instanceId >= this.maxInstancesPerModel) {
      console.warn(`Max instances reached for ${modelName}`)
      const delay = Phaser.Math.Between(1000, 2000)
      this.time.delayedCall(delay, () => this.spawnFruit())
      return
    }
    
    const letter = Phaser.Utils.Array.GetRandom(availableLetters)
    
    // Set position, rotation, scale
    const startX = Phaser.Math.Between(-20, 20)
    const startZ = -15
    const position = new THREE.Vector3(startX, 0, startZ)
    const rotation = new THREE.Euler(0, 0, 0)
    const quaternion = new THREE.Quaternion().setFromEuler(rotation)
    const scale = new THREE.Vector3().setScalar(spawnBomb ? 2.0 : 0.33)
    
    // Create sprite
    const spriteMaterial = this.letterMaterials.get(letter)
    if (!spriteMaterial) return
    
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(2.625, 2.625, 1)
    sprite.frustumCulled = false
    sprite.position.copy(position)
    sprite.position.y += 5
    this.third.scene.add(sprite)
    
    // Create FruitData on demand
    const fruit: FruitData = {
      instancedMesh: instancedMesh,
      instanceId: instanceId,
      modelName: modelName,
      letter: letter,
      sprite: sprite,
      spawnTime: this.time.now,
      isActive: true,
      position: position,
      rotation: rotation,
      quaternion: quaternion,
      scale: scale,
      matrix: new THREE.Matrix4(),
      velocity: new THREE.Vector3(-startX * 0.3, 0, Phaser.Math.Between(27, 30)),
      angularVelocity: new THREE.Vector3(
        Phaser.Math.FloatBetween(-2, 2),
        Phaser.Math.FloatBetween(-2, 2),
        Phaser.Math.FloatBetween(-2, 2)
      ),
      color: this.getFruitColor(modelName),
      spriteOffset: 0,
      isBomb: spawnBomb,
      scoreCountdown: 2000 // Start countdown at 2000
    }
    
    // Update instance matrix
    fruit.matrix.compose(fruit.position, fruit.quaternion, fruit.scale)
    instancedMesh.setMatrixAt(instanceId, fruit.matrix)
    instancedMesh.instanceMatrix.needsUpdate = true
    
    // Update instance count if needed
    if (instancedMesh.count <= instanceId) {
      instancedMesh.count = instanceId + 1
    }
    
    // If it's a bomb, add flint effects
    if (spawnBomb) {
      this.createBombFlintEffects(fruit)
    }
    
    this.fruits.push(fruit)
    this.updateLettersDisplay()
    
    // Record spawn time
    this.lastSpawnTime = this.time.now
    
    // Schedule next fruit
    const delay = Phaser.Math.Between(1000, 2000)
    this.time.delayedCall(delay, () => this.spawnFruit())
  }

  createBombFlintEffects(bomb: FruitData) {
    // Create flickering point light at flint position
    const flintLight = new THREE.PointLight(0xff6600, 500, 20)  // Bright orange flickering light
    this.third.scene.add(flintLight)
    bomb.flintLight = flintLight
    
    // Create 3D sparkler particles
    bomb.flintParticles = []
    for (let i = 0; i < 15; i++) {
      // Create slightly larger glowing sphere for each spark
      const sparkGeometry = new THREE.SphereGeometry(0.08, 4, 4)  // Increased from 0.05 to 0.08
      const sparkMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 1
      })
      const spark = new THREE.Mesh(sparkGeometry, sparkMaterial)
      this.third.scene.add(spark)
      bomb.flintParticles.push(spark)
    }
    
    // Play looping fuse sound
    bomb.fuseSound = this.sound.add('fuse', { loop: true, volume: 0.4 })
    bomb.fuseSound.play()
  }

  updateBombEffects(bomb: FruitData, deltaSeconds: number) {
    if (!bomb.flintLight || !bomb.flintParticles) return
    
    // Update 3D sparkler particles
    bomb.flintParticles.forEach((spark, idx) => {
      // Slower rotation for longer TTL, more variance in position
      const angle = (idx / bomb.flintParticles!.length) * Math.PI * 2 + this.time.now * 0.002  // Slower rotation
      const radius = 0.3 + Math.random() * 0.3  // More variance
      const height = Math.random() * 0.6 - 0.3  // More vertical variance
      
      // Create spark offset in local coordinates
      const sparkOffsetLocal = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        2.5 + height  // Along Z axis at fuse position
      )
      
      // Transform to world coordinates
      const sparkOffsetWorld = sparkOffsetLocal.applyQuaternion(bomb.quaternion)
      spark.position.copy(bomb.position).add(sparkOffsetWorld)
      
      // Random opacity for flickering effect
      const material = spark.material as THREE.MeshBasicMaterial
      material.opacity = Math.random() * 0.4 + 0.6  // Higher opacity range
      
      // More varied color between yellow, orange, and white-hot
      const colorValue = Math.random()
      if (colorValue > 0.7) {
        material.color.setHex(0xff6600) // Orange
      } else if (colorValue > 0.4) {
        material.color.setHex(0xffff00) // Yellow
      } else {
        material.color.setHex(0xffffcc) // Pale yellow (white-hot)
      }
    })
    
    // Update flint light position - higher up on the Z axis
    // Create offset in LOCAL coordinates (along positive Z axis where the fuse is)
    const flintOffsetLocal = new THREE.Vector3(0, 0, 2.5)  // Higher up the Z axis
    // Transform to WORLD coordinates using bomb's rotation
    const flintOffsetWorld = flintOffsetLocal.clone().applyQuaternion(bomb.quaternion)
    // Set light position = bomb position + transformed offset
    bomb.flintLight.position.copy(bomb.position).add(flintOffsetWorld)
    
    // Flicker the light intensity (much brighter)
    bomb.flintLight.intensity = 300 + Math.random() * 400
  }

  cleanupBombEffects(bomb: FruitData) {
    if (bomb.flintLight) {
      this.third.scene.remove(bomb.flintLight)
      bomb.flintLight = undefined
    }
    if (bomb.flintParticles) {
      bomb.flintParticles.forEach(spark => {
        this.third.scene.remove(spark)
        spark.geometry.dispose()
        if (spark.material instanceof THREE.Material) {
          spark.material.dispose()
        }
      })
      bomb.flintParticles = undefined
    }
    if (bomb.fuseSound) {
      bomb.fuseSound.stop()
      bomb.fuseSound.destroy()
      bomb.fuseSound = undefined
    }
  }

  startBananaBonanza() {
    this.bananaBonanzaActive = true
    this.bananaBonanzaCount = 0
    
    // Show the text
    if (this.bananaBonanzaText) {
      this.bananaBonanzaText.setVisible(true)
    }
    
    // Spawn bananas every 0.25 seconds, alternating left/right
    this.bananaBonanzaTimer = this.time.addEvent({
      delay: 250,
      callback: () => this.spawnBonanzaBanana(),
      repeat: 19 // 20 total bananas (0-19)
    })
  }

  spawnBonanzaBanana() {
    const modelName = 'SM_Banana'
    
    // Get instanced mesh for banana
    const instancedMesh = this.instancedMeshes.get(modelName)
    if (!instancedMesh) {
      console.warn(`No instanced mesh for ${modelName}`)
      return
    }
    
    // Get instance ID
    const freeIds = this.freeInstanceIds.get(modelName)!
    let instanceId: number
    if (freeIds.length > 0) {
      instanceId = freeIds.pop()!
    } else {
      instanceId = this.nextInstanceId.get(modelName)!
      this.nextInstanceId.set(modelName, instanceId + 1)
    }
    
    if (instanceId >= this.maxInstancesPerModel) {
      console.warn(`Max instances reached for ${modelName}`)
      return
    }
    
    // Alternate between left and right
    const fromLeft = this.bananaBonanzaCount % 2 === 0
    const startX = fromLeft ? -20 : 20
    const velocityX = fromLeft ? 15 : -15 // Shoot across screen
    
    const letter = Phaser.Utils.Array.GetRandom('abcdefghijklmnopqrstuvwxyz'.split(''))
    
    const position = new THREE.Vector3(startX, 0, -15)
    const rotation = new THREE.Euler(0, 0, 0)
    const quaternion = new THREE.Quaternion().setFromEuler(rotation)
    const scale = new THREE.Vector3(0.33, 0.33, 0.33)
    
    // Create sprite
    const spriteMaterial = this.letterMaterials.get(letter)
    if (!spriteMaterial) return
    
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(2.625, 2.625, 1)
    sprite.position.copy(position)
    sprite.position.y += 5
    this.third.scene.add(sprite)
    
    const fruit: FruitData = {
      instancedMesh: instancedMesh,
      instanceId: instanceId,
      modelName: modelName,
      letter: letter,
      sprite: sprite,
      spawnTime: this.time.now,
      isActive: true,
      position: position,
      rotation: rotation,
      quaternion: quaternion,
      scale: scale,
      matrix: new THREE.Matrix4(),
      velocity: new THREE.Vector3(velocityX, 0, Phaser.Math.Between(27, 30)),
      angularVelocity: new THREE.Vector3(
        Phaser.Math.FloatBetween(-2, 2),
        Phaser.Math.FloatBetween(-2, 2),
        Phaser.Math.FloatBetween(-2, 2)
      ),
      color: this.getFruitColor(modelName),
      spriteOffset: 0,
      isBomb: false,
      scoreCountdown: 2000
    }
    
    // Get sprite offset for centering
    const modelData = this.fruitModels.get(modelName)
    if (modelData) {
      const bbox = new THREE.Box3().setFromBufferAttribute(
        modelData.geometry.attributes.position as THREE.BufferAttribute
      )
      const center = new THREE.Vector3()
      bbox.getCenter(center)
      fruit.spriteOffset = center.z
    }
    
    // Update instance matrix
    fruit.matrix.compose(fruit.position, fruit.quaternion, fruit.scale)
    fruit.instancedMesh.setMatrixAt(fruit.instanceId, fruit.matrix)
    fruit.instancedMesh.instanceMatrix.needsUpdate = true
    
    // Increase visible instance count if needed
    if (fruit.instanceId >= fruit.instancedMesh.count) {
      fruit.instancedMesh.count = fruit.instanceId + 1
    }
    
    this.fruits.push(fruit)
    this.bananaBonanzaCount++
    
    // End bonanza after 20 bananas
    if (this.bananaBonanzaCount >= 20) {
      this.endBananaBonanza()
    }
    
    this.updateLettersDisplay()
  }

  endBananaBonanza() {
    this.bananaBonanzaActive = false
    
    // Hide the text
    if (this.bananaBonanzaText) {
      this.bananaBonanzaText.setVisible(false)
    }
    
    // Schedule next bonanza in 60 seconds
    this.nextBonanzaTime = this.time.now + 60000
    
    // Resume regular fruit spawning
    this.time.delayedCall(1000, () => this.spawnFruit())
  }

  updateLettersDisplay() {
    const activeLetters = this.fruits
      .filter(f => f.isActive)
      .map(f => f.letter.toUpperCase())
      .sort()
      .join(' ')
    
    if (this.lettersText) {
      this.lettersText.setText(activeLetters)
    }
  }

  removeFruit(fruitData: FruitData) {
    // Hide instance
    const hideMatrix = new THREE.Matrix4().setPosition(0, -500, 0)
    fruitData.instancedMesh.setMatrixAt(fruitData.instanceId, hideMatrix)
    fruitData.instancedMesh.instanceMatrix.needsUpdate = true
    
    // Hide sprite
    fruitData.sprite.position.set(0, -500, 0)
    fruitData.sprite.visible = false
    
    // Return instance ID to free pool for reuse
    const freeIds = this.freeInstanceIds.get(fruitData.modelName)!
    freeIds.push(fruitData.instanceId)
    
    // Mark as inactive
    fruitData.isActive = false
    
    // Remove from active list
    const index = this.fruits.indexOf(fruitData)
    if (index > -1) {
      this.fruits.splice(index, 1)
    }
    
    // Destroy sprite to free memory
    this.third.scene.remove(fruitData.sprite)
  }

  chopFruit(fruitData: FruitData) {
    if (!fruitData.isActive) return
    
    // Check if it's a bomb
    if (fruitData.isBomb) {
      // BOMB EXPLOSION! Deduct a life
      this.lives--
      if (this.livesText) {
        this.livesText.setText(`❤️ Lives: ${this.lives}`)
      }
      
      // Play explosion sound
      this.sound.play('explosion', { volume: 1.0 })
      
      // VIOLENT camera shake for explosion
      this.cameras.main.shake(800, 0.03)  // 800ms duration, 0.03 intensity (much stronger)
      
      // Red flash effect for explosion
      this.cameras.main.flash(400, 255, 0, 0)  // 400ms, full red
      
      // Create explosion effect
      this.createExplosionEffect(fruitData)
      
      // Draw blast splat on wall
      this.drawBlastOnWall(fruitData.position)
      
      // Cleanup bomb effects (stops fuse sound)
      this.cleanupBombEffects(fruitData)
      fruitData.isBomb = false
      
      // Remove fruit
      this.removeFruit(fruitData)
      
      this.updateLettersDisplay()
      
      // Check game over
      if (this.lives <= 0) {
        this.gameOver()
      }
      
      return
    }
    
    // Regular fruit chopping - add countdown value to score
    let pointsEarned = Math.round(fruitData.scoreCountdown)
    
    // Double points for bananas during Banana Bonanza
    if (this.bananaBonanzaActive && fruitData.modelName === 'SM_Banana') {
      pointsEarned *= 2
    }
    
    this.score += pointsEarned
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`)
    }
    
    // Play hit sound
    const hitSound = Phaser.Math.RND.pick(['hit_1', 'hit_3'])
    this.sound.play(hitSound, { volume: 0.5 })
    
    this.createSliceEffect(fruitData)
    
    // Create cut pieces if this fruit has cut models
    if (this.fruitCutModels.has(fruitData.modelName)) {
      this.createCutPieces(fruitData)
    }
    
    // Remove fruit
    this.removeFruit(fruitData)
    
    this.updateLettersDisplay()
  }

  createExplosionEffect(bombData: FruitData) {
    // Get 2D screen position
    const pos = bombData.position.clone()
    const screenPos = pos.project(this.third.camera)
    const x = (screenPos.x + 1) / 2 * 1280
    const y = -(screenPos.y - 1) / 2 * 800
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
      const particle = this.add.graphics()
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 300 + 100
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed
      const size = Math.random() * 8 + 4
      
      particle.fillStyle(0xff6600, 1.0)  // Orange explosion
      particle.fillCircle(x, y, size)
      
      const startTime = this.time.now
      const duration = 500
      
      const updateParticle = () => {
        const elapsed = this.time.now - startTime
        const t = elapsed / duration
        
        if (t >= 1) {
          particle.destroy()
          updateEvent.remove()
          return
        }
        
        particle.x += velocityX * 0.016
        particle.y += velocityY * 0.016
        particle.alpha = 1 - t
      }
      
      const updateEvent = this.time.addEvent({
        delay: 16,
        callback: updateParticle,
        loop: true
      })
    }
    
    // Flash effect
    const flash = this.add.rectangle(640, 400, 1280, 800, 0xff0000, 0.5)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    })
  }

  fruitMissed(fruitData: FruitData) {
    if (!fruitData.isActive) return
    
    // Cleanup bomb effects if it's a bomb
    if (fruitData.isBomb) {
      this.cleanupBombEffects(fruitData)
      fruitData.isBomb = false
      
      // Remove bomb (no screen effects for missed bombs)
      this.removeFruit(fruitData)
      
      return // Exit early, no screen effects for bombs
    }
    
    // Only fruits cause screen effects when missed
    // TEMPORARILY DISABLED FOR TESTING - INFINITE LIVES
    // this.lives--
    // if (this.livesText) {
    //   this.livesText.setText(`❤️ Lives: ${this.lives}`)
    // }
    
    this.cameras.main.shake(200, 0.005)
    this.cameras.main.flash(150, 128, 0, 0)  // More subtle red flash
    
    // TEMPORARILY DISABLED FOR TESTING
    // if (this.lives <= 0) {
    //   this.gameOver()
    // }
    
    // Remove fruit
    this.removeFruit(fruitData)
    
    this.updateLettersDisplay()
  }

  createCutPieces(fruitData: FruitData) {
    // Get the cut model names for this fruit
    const cutModels = this.fruitCutModels.get(fruitData.modelName)
    if (!cutModels) return
    
    // Get instanced meshes for cut pieces
    const leftInstancedMesh = this.cutPieceInstancedMeshes.get(cutModels.left)
    const rightInstancedMesh = this.cutPieceInstancedMeshes.get(cutModels.right)
    
    if (!leftInstancedMesh || !rightInstancedMesh) {
      console.warn(`No instanced meshes for cut pieces of ${fruitData.modelName}!`)
      return
    }
    
    // Get instance IDs (reuse freed slots or get next available)
    const leftFreeIds = this.freeCutPieceInstanceIds.get(cutModels.left)!
    const rightFreeIds = this.freeCutPieceInstanceIds.get(cutModels.right)!
    
    let leftInstanceId: number
    if (leftFreeIds.length > 0) {
      leftInstanceId = leftFreeIds.pop()!
    } else {
      leftInstanceId = this.nextCutPieceInstanceId.get(cutModels.left)!
      this.nextCutPieceInstanceId.set(cutModels.left, leftInstanceId + 1)
    }
    
    let rightInstanceId: number
    if (rightFreeIds.length > 0) {
      rightInstanceId = rightFreeIds.pop()!
    } else {
      rightInstanceId = this.nextCutPieceInstanceId.get(cutModels.right)!
      this.nextCutPieceInstanceId.set(cutModels.right, rightInstanceId + 1)
    }
    
    // Check max instances
    if (leftInstanceId >= this.maxInstancesPerModel || rightInstanceId >= this.maxInstancesPerModel) {
      console.warn(`Max cut piece instances reached!`)
      return
    }
    
    // Calculate separation vector in world space
    const separationVectorWorld = new THREE.Vector3(1, 0, 0)
    separationVectorWorld.applyQuaternion(fruitData.quaternion)
    const separationForce = 3
    
    // Create left piece
    const leftPiece: CutPieceData = {
      instancedMesh: leftInstancedMesh,
      instanceId: leftInstanceId,
      modelName: cutModels.left,
      originalFruitModelName: fruitData.modelName,
      position: fruitData.position.clone(),
      rotation: fruitData.rotation.clone(),
      quaternion: fruitData.quaternion.clone(),
      scale: fruitData.scale.clone(),
      matrix: new THREE.Matrix4(),
      velocity: fruitData.velocity.clone(),
      angularVelocity: fruitData.angularVelocity.clone(),
      isActive: true
    }
    leftPiece.velocity.x -= separationVectorWorld.x * separationForce
    leftPiece.velocity.y -= separationVectorWorld.y * separationForce
    leftPiece.velocity.z -= separationVectorWorld.z * separationForce
    
    // Update left instance matrix
    leftPiece.matrix.compose(leftPiece.position, leftPiece.quaternion, leftPiece.scale)
    leftInstancedMesh.setMatrixAt(leftInstanceId, leftPiece.matrix)
    leftInstancedMesh.instanceMatrix.needsUpdate = true
    if (leftInstancedMesh.count <= leftInstanceId) {
      leftInstancedMesh.count = leftInstanceId + 1
    }
    
    // Create right piece
    const rightPiece: CutPieceData = {
      instancedMesh: rightInstancedMesh,
      instanceId: rightInstanceId,
      modelName: cutModels.right,
      originalFruitModelName: fruitData.modelName,
      position: fruitData.position.clone(),
      rotation: fruitData.rotation.clone(),
      quaternion: fruitData.quaternion.clone(),
      scale: fruitData.scale.clone(),
      matrix: new THREE.Matrix4(),
      velocity: fruitData.velocity.clone(),
      angularVelocity: fruitData.angularVelocity.clone(),
      isActive: true
    }
    rightPiece.velocity.x += separationVectorWorld.x * separationForce
    rightPiece.velocity.y += separationVectorWorld.y * separationForce
    rightPiece.velocity.z += separationVectorWorld.z * separationForce
    
    // Update right instance matrix
    rightPiece.matrix.compose(rightPiece.position, rightPiece.quaternion, rightPiece.scale)
    rightInstancedMesh.setMatrixAt(rightInstanceId, rightPiece.matrix)
    rightInstancedMesh.instanceMatrix.needsUpdate = true
    if (rightInstancedMesh.count <= rightInstanceId) {
      rightInstancedMesh.count = rightInstanceId + 1
    }
    
    // Add to active pieces list
    this.cutPieces.push(leftPiece)
    this.cutPieces.push(rightPiece)
    
    // Draw slice plane animations for all fruits
    this.drawSlicePlane(fruitData)
  }
  
  create3DJuiceDroplets(fruitData: FruitData) {
    const numDroplets = 15
    const droplets: { mesh: THREE.Mesh, velocity: THREE.Vector3 }[] = []
    
    // Create a simple teardrop shape geometry
    const createDropletGeometry = () => {
      const geometry = new THREE.SphereGeometry(0.15, 8, 8)
      // Stretch it to make it more teardrop-like
      const positions = geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i)
        if (y > 0) {
          // Taper the top
          const scale = 1 - (y / 0.15) * 0.3
          positions.setX(i, positions.getX(i) * scale)
          positions.setZ(i, positions.getZ(i) * scale)
        }
      }
      geometry.computeVertexNormals()
      return geometry
    }
    
    const dropletGeometry = createDropletGeometry()
    const dropletMaterial = new THREE.MeshBasicMaterial({
      color: fruitData.color,
      transparent: true,
      opacity: 0.8
    })
    
    for (let i = 0; i < numDroplets; i++) {
      const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial.clone())
      
      // Start at fruit position
      droplet.position.copy(fruitData.position)
      
      // Generate random direction in LOCAL XZ plane
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const speed = Phaser.Math.FloatBetween(8, 15)
      
      // Velocity in local XZ plane (Y=0 in local space)
      const localVelocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        0,  // No Y component in local space
        Math.sin(angle) * speed
      )
      
      // Transform velocity to world space using fruit's rotation
      const worldVelocity = localVelocity.applyQuaternion(fruitData.quaternion)
      
      droplet.scale.set(1, 1.2, 1) // Slightly elongated
      this.third.scene.add(droplet)
      
      droplets.push({ mesh: droplet, velocity: worldVelocity })
    }
    
    // Animate droplets with physics
    const gravity = -30
    const startTime = this.time.now
    let lastTime = startTime
    
    const updateDroplets = () => {
      const currentTime = this.time.now
      const elapsed = (currentTime - startTime) / 1000
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime
      
      if (elapsed > 2) {
        // Clean up after 2 seconds
        droplets.forEach(d => {
          this.third.scene.remove(d.mesh)
          d.mesh.geometry.dispose()
          if (d.mesh.material instanceof THREE.Material) {
            d.mesh.material.dispose()
          }
        })
        this.time.removeEvent(updateEvent)
        return
      }
      
      droplets.forEach(d => {
        // Apply gravity
        d.velocity.y += gravity * deltaTime
        
        // Update position
        d.mesh.position.x += d.velocity.x * deltaTime
        d.mesh.position.y += d.velocity.y * deltaTime
        d.mesh.position.z += d.velocity.z * deltaTime
        
        // Rotate droplet to point in direction of travel
        const direction = d.velocity.clone().normalize()
        d.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
        
        // Fade out
        if (d.mesh.material instanceof THREE.MeshBasicMaterial) {
          d.mesh.material.opacity = Math.max(0, 0.8 - elapsed * 0.4)
        }
      })
    }
    
    const updateEvent = this.time.addEvent({
      delay: 16,
      callback: updateDroplets,
      loop: true
    })
  }
  
  drawSlicePlane(fruitData: FruitData) {
    // Create a circular slice effect that expands outward in the XZ plane
    const sliceGeometry = new THREE.RingGeometry(0.2, 0.5, 32)
    
    // Create a bright yellow, glowing material
    const sliceMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0
    })
    
    const sliceMesh = new THREE.Mesh(sliceGeometry, sliceMaterial)
    
    // By default, RingGeometry is in the XY plane
    // Rotate it 90 degrees around X to make it XZ plane
    sliceMesh.rotation.x = Math.PI / 2
    
    // Position and rotate the slice to match the fruit's transform
    sliceMesh.position.copy(fruitData.position)
    sliceMesh.quaternion.copy(fruitData.quaternion)
    
    // Apply the local rotation (90 degrees around X) AFTER the fruit's rotation
    const localRotation = new THREE.Quaternion()
    localRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    sliceMesh.quaternion.multiply(localRotation)
    
    this.third.scene.add(sliceMesh)
    
    // Animate the slice expanding and fading using scale instead of recreating geometry
    this.tweens.add({
      targets: sliceMesh.scale,
      x: 30,
      y: 30,
      z: 30,
      duration: 300,
      ease: 'Cubic.easeOut'
    })
    
    this.tweens.add({
      targets: sliceMaterial,
      opacity: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.third.scene.remove(sliceMesh)
        sliceMesh.geometry.dispose()
        sliceMaterial.dispose()
      }
    })
    
    // Also create a 3D swipe trail in the slice plane
    this.create3DSwipeTrail(fruitData)
  }
  
  create3DSwipeTrail(fruitData: FruitData) {
    // Create a curved, tapering swipe trail in the XZ plane (local coordinates)
    const trailLength = 12  // Larger trail
    const maxThickness = 0.6  // Thicker trail
    const numSegments = 30
    
    // Random angle for the swipe direction (in the XZ plane)
    const swipeAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)
    
    // Create vertices for a tapered curve
    const vertices: number[] = []
    const indices: number[] = []
    
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments
      
      // Position along the curve (with slight curve)
      const distance = (t - 0.5) * trailLength
      const curve = Math.sin(t * Math.PI) * 0.8 // Slightly more curve
      
      // Thickness tapers from center to edges
      const thickness = maxThickness * Math.sin(t * Math.PI)
      
      // Calculate position in local XZ plane
      const x = Math.cos(swipeAngle) * distance + Math.sin(swipeAngle) * curve
      const z = Math.sin(swipeAngle) * distance - Math.cos(swipeAngle) * curve
      
      // Create two vertices (top and bottom of the trail)
      const perpX = -Math.sin(swipeAngle) * thickness
      const perpZ = Math.cos(swipeAngle) * thickness
      
      // Top vertex
      vertices.push(x + perpX, 0, z + perpZ)
      // Bottom vertex
      vertices.push(x - perpX, 0, z - perpZ)
      
      // Create triangles (except for last segment)
      if (i < numSegments) {
        const base = i * 2
        indices.push(base, base + 1, base + 2)
        indices.push(base + 1, base + 3, base + 2)
      }
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    
    const trailMesh = new THREE.Mesh(geometry, material)
    
    // Position and rotate to match fruit's transform
    trailMesh.position.copy(fruitData.position)
    trailMesh.quaternion.copy(fruitData.quaternion)
    
    // Apply local rotation to put it in XZ plane
    const localRotation = new THREE.Quaternion()
    localRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    trailMesh.quaternion.multiply(localRotation)
    
    this.third.scene.add(trailMesh)
    
    // Fade out the trail
    const trailData = { opacity: 0.8 }
    this.tweens.add({
      targets: trailData,
      opacity: 0,
      duration: 400,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        material.opacity = trailData.opacity
      },
      onComplete: () => {
        this.third.scene.remove(trailMesh)
        geometry.dispose()
        material.dispose()
      }
    })
  }

  setupWallCanvasTexture(wallMaterial: any) {
    console.log('Setting up wall canvas texture...')
    console.log('Wall material:', wallMaterial)
    console.log('Wall material.map:', wallMaterial.map)
    console.log('Wall material.normalMap:', wallMaterial.normalMap)
    console.log('Wall material.roughnessMap:', wallMaterial.roughnessMap)
    console.log('Wall material.metalnessMap:', wallMaterial.metalnessMap)
    console.log('Wall material.aoMap:', wallMaterial.aoMap)
    
    // Wait for the texture to load if it exists
    const setupCanvas = () => {
      // Create a smaller canvas (1024 instead of 2048 = 4x less data to upload!)
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      
      const ctx = canvas.getContext('2d')!
      
      // If there's an existing texture, draw it first
      if (wallMaterial.map && wallMaterial.map.image) {
        const img = wallMaterial.map.image
        console.log('Drawing existing texture:', img, 'Size:', img.width, 'x', img.height)
        
        // Make sure image is loaded
        if (img.complete || img.width > 0) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        } else {
          console.warn('Image not loaded yet, using fallback')
          // Use a wood-like color as fallback
          ctx.fillStyle = '#8B6F47'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      } else {
        // No existing texture - use a wood-like color
        console.log('No existing texture map, using wood color')
        ctx.fillStyle = '#8B6F47'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      console.log('Canvas size:', canvas.width, 'x', canvas.height)
      
      // Store references
      this.wallCanvas = canvas
      this.wallCanvasContext = ctx
      
      // Create a canvas texture
      const canvasTexture = new THREE.CanvasTexture(canvas)
      canvasTexture.colorSpace = THREE.SRGBColorSpace
      canvasTexture.needsUpdate = true
      
      // IMPORTANT: Keep all the other texture maps (normal, roughness, etc.)
      // Only replace the color map with our canvas texture
      const originalMap = wallMaterial.map
      wallMaterial.map = canvasTexture
      
      // Copy texture settings from original
      if (originalMap) {
        canvasTexture.wrapS = originalMap.wrapS
        canvasTexture.wrapT = originalMap.wrapT
        canvasTexture.repeat.copy(originalMap.repeat)
        canvasTexture.offset.copy(originalMap.offset)
        canvasTexture.rotation = originalMap.rotation
        canvasTexture.center.copy(originalMap.center)
      }
      
      wallMaterial.needsUpdate = true
      
      this.wallTexture = canvasTexture
      
      console.log('Wall canvas texture setup complete!')
      console.log('Preserved normal map:', wallMaterial.normalMap)
      console.log('Preserved roughness map:', wallMaterial.roughnessMap)
    }
    
    // If texture exists but might not be loaded, wait for it
    if (wallMaterial.map && wallMaterial.map.image && !wallMaterial.map.image.complete) {
      console.log('Waiting for texture to load...')
      wallMaterial.map.image.onload = () => {
        console.log('Texture loaded!')
        setupCanvas()
      }
    } else {
      setupCanvas()
    }
  }

  setupWallNormalCanvas(wallMaterial: any) {
    console.log('Setting up wall normal canvas texture...')
    
    const setupNormalCanvas = () => {
      // Create canvas for normal map
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      
      const ctx = canvas.getContext('2d')!
      
      // If there's an existing normal map, draw it first
      if (wallMaterial.normalMap && wallMaterial.normalMap.image) {
        const img = wallMaterial.normalMap.image
        console.log('Drawing existing normal map:', img, 'Size:', img.width, 'x', img.height)
        
        if (img.complete || img.width > 0) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        } else {
          console.warn('Normal map not loaded yet, using flat normal')
          // Flat normal map (128, 128, 255) = pointing straight out
          ctx.fillStyle = '#8080ff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      } else {
        // No existing normal map - use flat normal
        console.log('No existing normal map, using flat normal')
        ctx.fillStyle = '#8080ff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      // Store references
      this.wallNormalCanvas = canvas
      this.wallNormalCanvasContext = ctx
      
      // Create a canvas texture for the normal map
      const canvasTexture = new THREE.CanvasTexture(canvas)
      canvasTexture.colorSpace = THREE.LinearSRGBColorSpace // Normal maps use linear space
      canvasTexture.needsUpdate = true
      
      // Copy texture settings from original normal map
      const originalNormalMap = wallMaterial.normalMap
      if (originalNormalMap) {
        canvasTexture.wrapS = originalNormalMap.wrapS
        canvasTexture.wrapT = originalNormalMap.wrapT
        canvasTexture.repeat.copy(originalNormalMap.repeat)
        canvasTexture.offset.copy(originalNormalMap.offset)
        canvasTexture.rotation = originalNormalMap.rotation
        canvasTexture.center.copy(originalNormalMap.center)
      }
      
      wallMaterial.normalMap = canvasTexture
      wallMaterial.needsUpdate = true
      
      this.wallNormalTexture = canvasTexture
      
      console.log('Wall normal canvas texture setup complete!')
    }
    
    // If normal map exists but might not be loaded, wait for it
    if (wallMaterial.normalMap && wallMaterial.normalMap.image && !wallMaterial.normalMap.image.complete) {
      console.log('Waiting for normal map to load...')
      wallMaterial.normalMap.image.onload = () => {
        console.log('Normal map loaded!')
        setupNormalCanvas()
      }
    } else {
      setupNormalCanvas()
    }
  }

  drawSplatterOnWall(fruitPosition: THREE.Vector3, fruitColor: number) {
    if (!this.wallCanvasContext || !this.wallTexture || !this.wallMesh || this.prerenderedSplats.size === 0) {
      return
    }
    
    const frameStart = performance.now()
    
    // Project fruit position onto wall
    const wallWidth = 40
    const wallHeight = 30
    
    // Map fruit position to UV coordinates (0 to 1)
    const u = (fruitPosition.x + wallWidth / 2) / wallWidth
    const v = (fruitPosition.z + wallHeight / 2) / wallHeight
    
    // Convert UV to canvas pixel coordinates
    const canvasX = u * this.wallCanvas!.width
    const canvasY = (1 - v) * this.wallCanvas!.height
    
    // Pick a random splat texture index
    const splatIdx = Math.floor(Math.random() * this.splatTextures.length)
    const key = `${splatIdx}_${fruitColor}`
    
    // Get the pre-rendered splat
    const prerenderedSplat = this.prerenderedSplats.get(key)
    if (!prerenderedSplat) return
    
    // Random scale and rotation (smaller splats)
    const scale = 0.4 + Math.random() * 0.4  // 0.4x to 0.8x size (was 0.8 to 1.6)
    const rotation = Math.random() * Math.PI * 2
    const splatWidth = prerenderedSplat.width * scale
    const splatHeight = prerenderedSplat.height * scale
    
    const ctx = this.wallCanvasContext
    
    // Draw the pre-rendered splat
    ctx.save()
    ctx.translate(canvasX, canvasY)
    ctx.rotate(rotation)
    ctx.globalAlpha = 0.2  // More transparent (was 0.3)
    ctx.drawImage(prerenderedSplat, -splatWidth / 2, -splatHeight / 2, splatWidth, splatHeight)
    ctx.restore()
    
    const drawTime = performance.now() - frameStart
    
    // Don't update texture immediately - batch updates to avoid lag
    // Mark that we need an update, but defer it
    if (!this.pendingTextureUpdate) {
      this.pendingTextureUpdate = true
      
      // Update texture on next frame (not immediately)
      requestAnimationFrame(() => {
        if (this.wallTexture) {
          const updateStart = performance.now()
          this.wallTexture.needsUpdate = true
          this.pendingTextureUpdate = false
          const updateTime = performance.now() - updateStart
          console.log(`Splat: Draw=${drawTime.toFixed(2)}ms, GPU upload=${updateTime.toFixed(2)}ms`)
        }
      })
    }
  }

  drawBlastOnWall(bombPosition: THREE.Vector3) {
    if (!this.wallCanvas || !this.wallCanvasContext || !this.wallTexture || !this.blastTexture) {
      return
    }
    
    // Project bomb position to UV coordinates on the wall (XZ plane at Y=0)
    const u = (bombPosition.x + 25) / 50  // Map X from [-25, 25] to [0, 1]
    const v = (bombPosition.z + 25) / 50  // Map Z from [-25, 25] to [0, 1]
    
    // Convert UV to canvas coordinates
    const canvasX = u * this.wallCanvas.width
    const canvasY = (1 - v) * this.wallCanvas.height
    
    // Draw the blast texture (much larger than fruit splats)
    const blastSize = 400 + Math.random() * 200  // Random size 400-600
    const rotation = Math.random() * Math.PI * 2
    
    // Draw color blast
    const ctx = this.wallCanvasContext
    ctx.save()
    ctx.translate(canvasX, canvasY)
    ctx.rotate(rotation)
    ctx.globalAlpha = 0.8  // More opaque than fruit splats
    ctx.drawImage(this.blastTexture, -blastSize / 2, -blastSize / 2, blastSize, blastSize)
    ctx.restore()
    
    // Draw normal map blast
    if (this.wallNormalCanvas && this.wallNormalCanvasContext && this.blastNormalTexture) {
      console.log('Drawing blast normal at:', canvasX, canvasY, 'size:', blastSize)
      const normalCanvasX = u * this.wallNormalCanvas.width
      const normalCanvasY = (1 - v) * this.wallNormalCanvas.height
      
      const normalCtx = this.wallNormalCanvasContext
      normalCtx.save()
      normalCtx.translate(normalCanvasX, normalCanvasY)
      normalCtx.rotate(rotation)
      normalCtx.globalAlpha = 0.8
      normalCtx.drawImage(this.blastNormalTexture, -blastSize / 2, -blastSize / 2, blastSize, blastSize)
      normalCtx.restore()
      
      // Update normal texture
      if (!this.pendingNormalTextureUpdate) {
        this.pendingNormalTextureUpdate = true
        requestAnimationFrame(() => {
          if (this.wallNormalTexture) {
            this.wallNormalTexture.needsUpdate = true
            this.pendingNormalTextureUpdate = false
            console.log('Normal texture updated!')
          }
        })
      }
    } else {
      console.warn('Cannot draw blast normal:', {
        hasCanvas: !!this.wallNormalCanvas,
        hasContext: !!this.wallNormalCanvasContext,
        hasTexture: !!this.blastNormalTexture
      })
    }
    
    // Update color texture
    if (!this.pendingTextureUpdate) {
      this.pendingTextureUpdate = true
      requestAnimationFrame(() => {
        if (this.wallTexture) {
          this.wallTexture.needsUpdate = true
          this.pendingTextureUpdate = false
        }
      })
    }
  }

  createSliceEffect(fruitData: FruitData) {
    // Save the 3D position for the light
    const pos3D = fruitData.position.clone()
    
    // Get 2D screen position for effects
    const pos = fruitData.position.clone()
    const screenPos = pos.project(this.third.camera)
    const x = (screenPos.x + 1) / 2 * 1280
    const y = -(screenPos.y - 1) / 2 * 800
    
    // HIDE 2D swipe effect for now
    // const sliceDirection = this.createSwipeEffect(x, y)
    const sliceDirection = 0
    
    // Create juice particles
    this.createJuiceParticles(x, y, sliceDirection, fruitData.color)
    
    // Draw splatter on wall
    this.drawSplatterOnWall(fruitData.position, fruitData.color)
    
    // Create point light flash - Very bright, matching fruit color
    const light = new THREE.PointLight(fruitData.color, 4000, 100)
    light.position.copy(pos3D)
    light.position.y -= 1
    this.third.scene.add(light)
    
    // Animate light intensity using a wrapper object that Phaser can tween
    const lightData = { intensity: 2000 }
    this.tweens.add({
      targets: lightData,
      intensity: 0,
      duration: 150,
      onUpdate: () => {
        light.intensity = lightData.intensity
      },
      onComplete: () => {
        this.third.scene.remove(light)
      }
    })
  }

  createSwipeEffect(x: number, y: number): number {
    // Create Fruit Ninja-style curved, tapering swipe trail
    const graphics = this.add.graphics()
    
    // Random angle for the swipe
    const slashAngle = Phaser.Math.Between(0, 360)
    const rad = Phaser.Math.DegToRad(slashAngle)
    
    // Store for return
    const sliceDirection = rad
    
    // Swipe parameters (DOUBLED)
    const trailLength = 300 // 2x larger
    const maxThickness = 24 // 2x larger
    const numPoints = 40 // More points for smoother curve
    
    // Create a curved path with tapering thickness
    const points: Array<{ x: number; y: number; thickness: number }> = []
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1) // 0 to 1
      
      // Calculate position along arc
      const curveAmount = 0.3 // How much the arc curves
      const perpAngle = rad + Math.PI / 2
      const curvature = Math.sin(t * Math.PI) * curveAmount // Arc in the middle
      
      const px = x + (t - 0.5) * trailLength * Math.cos(rad) + curvature * 60 * Math.cos(perpAngle)
      const py = y + (t - 0.5) * trailLength * Math.sin(rad) + curvature * 60 * Math.sin(perpAngle)
      
      // Taper: thick at the front (t=0), thin at the back (t=1)
      const thickness = maxThickness * (1 - t * 0.9) // Taper to almost nothing
      
      points.push({ x: px, y: py, thickness: thickness })
    }
    
    // Animate drawing the swipe over 0.05 seconds
    let drawProgress = 0
    const drawDuration = 50 // 0.05 seconds 
    const startTime = this.time.now
    
    const drawSwipe = () => {
      const elapsed = this.time.now - startTime
      drawProgress = Math.min(elapsed / drawDuration, 1) // 0 to 1
      
      // Clear and redraw
      graphics.clear()
      
      // Calculate how many points to draw based on progress (drawing from back to front)
      const pointsToDraw = Math.floor(points.length * drawProgress)
      const startIndex = points.length - pointsToDraw
      
      if (pointsToDraw > 1) {
        // Draw main stroke with variable thickness and round caps
        for (let i = startIndex; i < points.length - 1; i++) {
          const point = points[i]
          const nextPoint = points[i + 1]
          
          // Set line style with round caps
          graphics.lineStyle(point.thickness, 0xffffff, 1.0)
          graphics.lineBetween(point.x, point.y, nextPoint.x, nextPoint.y)
        }
        
        // Add semi-circle end caps using arcs
        if (pointsToDraw > 1) {
          graphics.fillStyle(0xffffff, 1.0)
          
          // Cap at the back (thin end)
          const backPoint = points[startIndex]
          const backNextPoint = points[startIndex + 1]
          const backAngle = Math.atan2(backNextPoint.y - backPoint.y, backNextPoint.x - backPoint.x)
          
          graphics.beginPath()
          graphics.arc(
            backPoint.x, 
            backPoint.y, 
            backPoint.thickness / 2,
            backAngle + Math.PI / 2,
            backAngle - Math.PI / 2,
            false
          )
          graphics.fillPath()
          
          // Cap at the front (thick end)
          const frontPoint = points[points.length - 1]
          const frontPrevPoint = points[points.length - 2]
          const frontAngle = Math.atan2(frontPoint.y - frontPrevPoint.y, frontPoint.x - frontPrevPoint.x)
          
          graphics.beginPath()
          graphics.arc(
            frontPoint.x, 
            frontPoint.y, 
            frontPoint.thickness / 2,
            frontAngle - Math.PI / 2,
            frontAngle + Math.PI / 2,
            false
          )
          graphics.fillPath()
        }
      }
      
      // Continue drawing until complete
      if (drawProgress < 1) {
        this.time.delayedCall(16, drawSwipe) // ~60fps
      } else {
        // Once drawing is complete, start fade out after 0.5 seconds
        this.tweens.add({
          targets: graphics,
          alpha: 0,
          duration: 750,
          ease: 'Power2',
          onComplete: () => {
            graphics.destroy()
          }
        })
      }
    }
    
    // Start the drawing animation
    drawSwipe()
    
    // Return the slice direction
    return sliceDirection
  }

  createJuiceParticles(x: number, y: number, sliceDirection: number, fruitColor: number) {
    // Create 5-10 juice particles
    const numParticles = Phaser.Math.Between(10, 20)
    
    for (let i = 0; i < numParticles; i++) {
      // Slight random offset from fruit center
      const startX = x + Phaser.Math.Between(-20, 20)
      const startY = y + Phaser.Math.Between(-20, 20)
      
      // Shoot out in ALL directions from center (ignore sliceDirection)
      const particleAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const speedMultiplier = Phaser.Math.FloatBetween(8, 25)
      
      const velocityX = Math.cos(particleAngle) * speedMultiplier
      const velocityY = Math.sin(particleAngle) * speedMultiplier
      
      // Create teardrop-shaped particle
      const particle = this.add.graphics()
      particle.x = startX
      particle.y = startY
      
      // Draw teardrop shape: semicircle + triangle
      const size = Phaser.Math.FloatBetween(4, 8)
      
      // Vary color slightly from fruit color
      const r = (fruitColor >> 16) & 0xFF
      const g = (fruitColor >> 8) & 0xFF
      const b = fruitColor & 0xFF
      
      // Add slight variation (±20) to each channel
      const rVaried = Math.max(0, Math.min(255, r + Phaser.Math.Between(-20, 20)))
      const gVaried = Math.max(0, Math.min(255, g + Phaser.Math.Between(-20, 20)))
      const bVaried = Math.max(0, Math.min(255, b + Phaser.Math.Between(-20, 20)))
      
      const variedColor = (rVaried << 16) | (gVaried << 8) | bVaried
      
      particle.fillStyle(variedColor, 1.0)
      
      // Draw teardrop in default orientation (facing right/0°)
      particle.beginPath()
      
      // Draw semicircle facing right (from -90° to +90°)
      particle.arc(0, 0, size, -Math.PI / 2, Math.PI / 2, false)
      
      // Connect to tail point (pointing left)
      const tailLength = size * 1.5
      particle.lineTo(-tailLength, 0)
      
      particle.closePath()
      particle.fillPath()
      
      // Rotate to face direction of travel
      particle.rotation = particleAngle
      
      // Animate particle with physics
      const startTime = this.time.now
      const duration = 1000 // 1 second
      const gravity = 0.3 // Gravity acceleration
      
      const updateParticle = () => {
        const elapsed = this.time.now - startTime
        const t = elapsed / duration
        
        if (t >= 1) {
          particle.destroy()
          updateEvent.remove() // CLEAN UP THE EVENT!
          return
        }
        
        // Update position with velocity and gravity
        particle.x += velocityX
        particle.y += velocityY + (gravity * elapsed / 20) // Apply gravity over time
        
        // Rotate to face direction of motion
        const currentVelY = velocityY + (gravity * elapsed / 20)
        particle.rotation = Math.atan2(currentVelY, velocityX)
        
        // Fade out
        particle.alpha = 1 - t
      }
      
      // Use a proper event that can be cleaned up
      const updateEvent = this.time.addEvent({
        delay: 16,
        callback: updateParticle,
        loop: true
      })
    }
  }

  update(time: number, delta: number) {
    const deltaSeconds = delta / 1000
    
    // Check if it's time for Banana Bonanza
    if (!this.bananaBonanzaActive && !this.isGameOverFlag && this.time.now >= this.nextBonanzaTime) {
      this.startBananaBonanza()
    }
    
    // Pulse the Banana Bonanza text
    if (this.bananaBonanzaActive && this.bananaBonanzaText) {
      const scale = 1 + Math.sin(time * 0.005) * 0.1
      this.bananaBonanzaText.setScale(scale)
    }
    
    // Track which instanced meshes need updates
    const meshesToUpdate = new Set<THREE.InstancedMesh>()
    
    // Manual physics for all fruits
    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const fruit = this.fruits[i]
      
      // Update score countdown (decrement by delta ms, but don't go below 500)
      if (!fruit.isBomb) {
        fruit.scoreCountdown = Math.max(500, fruit.scoreCountdown - delta)
      }
      
      // Apply gravity to velocity
      fruit.velocity.z -= 20 * deltaSeconds
      
      // Update position based on velocity
      fruit.position.x += fruit.velocity.x * deltaSeconds
      fruit.position.y += fruit.velocity.y * deltaSeconds
      fruit.position.z += fruit.velocity.z * deltaSeconds
      
      // Update rotation based on angular velocity
      fruit.rotation.x += fruit.angularVelocity.x * deltaSeconds
      fruit.rotation.y += fruit.angularVelocity.y * deltaSeconds
      fruit.rotation.z += fruit.angularVelocity.z * deltaSeconds
      fruit.quaternion.setFromEuler(fruit.rotation)
      
      // Update instance matrix
      fruit.matrix.compose(fruit.position, fruit.quaternion, fruit.scale)
      fruit.instancedMesh.setMatrixAt(fruit.instanceId, fruit.matrix)
      meshesToUpdate.add(fruit.instancedMesh)
      
      // Update sprite position to follow fruit (at center of AABB)
      const offset = new THREE.Vector3(0, 0, fruit.spriteOffset)
      offset.applyQuaternion(fruit.quaternion)
      
      fruit.sprite.position.copy(fruit.position)
      fruit.sprite.position.add(offset)
      fruit.sprite.position.y += 5 // Offset towards camera
      
      // Update bomb effects if this is a bomb
      if (fruit.isBomb) {
        this.updateBombEffects(fruit, deltaSeconds)
      }
      
      // Check if fruit has fallen below screen (Z < -20)
      if (fruit.position.z < -20) {
        this.fruitMissed(fruit)
      }
    }
    
    // Update all modified instanced meshes at once
    meshesToUpdate.forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true
    })
    
    // Manual physics for cut pieces
    const cutMeshesToUpdate = new Set<THREE.InstancedMesh>()
    
    for (let i = this.cutPieces.length - 1; i >= 0; i--) {
      const piece = this.cutPieces[i]
      
      if (!piece.isActive) continue
      
      // Apply gravity to velocity
      piece.velocity.z -= 20 * deltaSeconds
      
      // Update position based on velocity
      piece.position.x += piece.velocity.x * deltaSeconds
      piece.position.y += piece.velocity.y * deltaSeconds
      piece.position.z += piece.velocity.z * deltaSeconds
      
      // Update rotation based on angular velocity
      piece.rotation.x += piece.angularVelocity.x * deltaSeconds
      piece.rotation.y += piece.angularVelocity.y * deltaSeconds
      piece.rotation.z += piece.angularVelocity.z * deltaSeconds
      piece.quaternion.setFromEuler(piece.rotation)
      
      // Update instance matrix
      piece.matrix.compose(piece.position, piece.quaternion, piece.scale)
      piece.instancedMesh.setMatrixAt(piece.instanceId, piece.matrix)
      cutMeshesToUpdate.add(piece.instancedMesh)
      
      // Check if piece has fallen off screen
      if (piece.position.z < -30) {
        piece.isActive = false
        // Hide instance
        const hideMatrix = new THREE.Matrix4().setPosition(0, -500, 0)
        piece.instancedMesh.setMatrixAt(piece.instanceId, hideMatrix)
        cutMeshesToUpdate.add(piece.instancedMesh)
        // Return instance ID to free pool
        const freeIds = this.freeCutPieceInstanceIds.get(piece.modelName)!
        freeIds.push(piece.instanceId)
        this.cutPieces.splice(i, 1)
      }
    }
    
    // Update all modified cut piece instanced meshes
    cutMeshesToUpdate.forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true
    })
  }

  easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  easeInCubic(t: number): number {
    return t * t * t
  }

  gameOver() {
    if (this.isGameOverFlag) return
    this.isGameOverFlag = true
    
    this.time.removeAllEvents()
    
    const bg = this.add.rectangle(640, 400, 1280, 800, 0x000000, 0.8)
    bg.name = 'gameOverUI'
    
    const title = this.add.text(640, 300, 'Game Over!', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    title.name = 'gameOverUI'
    
    const score = this.add.text(640, 400, `Final Score: ${this.score}`, {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    score.name = 'gameOverUI'
    
    const retryBtn = this.add.rectangle(640, 500, 200, 60, 0x4a4a8a)
      .setStrokeStyle(3, 0x6a6aff)
      .setInteractive({ useHandCursor: true })
    retryBtn.name = 'gameOverUI'
    
    const retryText = this.add.text(640, 500, 'Retry', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    retryText.name = 'gameOverUI'
    
    retryBtn.on('pointerover', () => retryBtn.setFillStyle(0x6a6aff))
    retryBtn.on('pointerout', () => retryBtn.setFillStyle(0x4a4a8a))
    retryBtn.on('pointerdown', () => {
      this.resetGame()
    })
  }
}
