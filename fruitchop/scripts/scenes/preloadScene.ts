export default class PreloadScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text
  private progressBar!: Phaser.GameObjects.Graphics
  private progressBox!: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Create loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Create progress bar background
    this.progressBox = this.add.graphics()
    this.progressBox.fillStyle(0x222222, 0.8)
    this.progressBox.fillRect(width / 2 - 160, height / 2, 320, 30)

    // Create progress bar
    this.progressBar = this.add.graphics()

    // Listen to progress events
    this.load.on('progress', (value: number) => {
      this.progressBar.clear()
      this.progressBar.fillStyle(0xffffff, 1)
      this.progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 10)
    })

    this.load.on('complete', () => {
      this.progressBar.destroy()
      this.progressBox.destroy()
      this.loadingText.destroy()
    })

    // Load all sound effects
    this.load.audio('miss', 'assets/sounds/miss.wav')
    this.load.audio('hit_1', 'assets/sounds/hit_1.wav')
    this.load.audio('hit_3', 'assets/sounds/hit_3.wav')
    this.load.audio('hit_big', 'assets/sounds/hit_big.wav')
    this.load.audio('hit_big_2', 'assets/sounds/hit_big_2.wav')
    this.load.audio('fuse', 'assets/sounds/fuse.wav')
    this.load.audio('explosion', 'assets/sounds/explosion.wav')
  }

  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
