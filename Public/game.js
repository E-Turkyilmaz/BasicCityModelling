var game = new Phaser.Game(800, 600, Phaser.AUTO, 'age-of-coding', null, true, false);
var InitGame = function(game){};
InitGame.Boot = function (game) {};

var tileGroup, buildingGroup, assetGroup, textGroup,
    cursorPos, cursors, currentTile;
var hasBuilding;

var assets = ["testAsset", "testAsset2", "testAsset3", "testAsset4", "testAsset5"];

InitGame.Boot.prototype = {
    preload: function () {
        // './assets/landscapeTiles_spritesheet.png',
        game.load.atlas('tiles', './assets/landscapeTiles_spritesheet.png', './assets/landscape_tiles.json');
        game.load.image('grass', './assets/landscapeTiles_067.png');
        game.load.image('testAsset', './assets/landscapeTiles_045.png', 132, 83);
        game.load.image('testAsset2', './assets/landscapeTiles_025.png');
        game.load.image('testAsset3', './assets/landscapeTiles_026.png');
        game.load.image('testAsset4', './assets/landscapeTiles_028.png');
        game.load.image('testAsset5', './assets/landscapeTiles_071.png');
        game.load.image('building', './assets/buildings/buildingTiles_030.png', 133, 127);
        game.time.advancedTiming = true;
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.setTo(0.5, 0.2);
        game.world.setBounds(0, 0, 1600, 1200);
        game.camera.x = 400;
        game.camera.y = 125;
    },
    create: function () {
        tileGroup = game.add.group();
        buildingGroup = game.add.group();
        assetGroup = game.add.group();

        this.spawnTiles();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursorPos = new Phaser.Plugin.Isometric.Point3();
        cursors = game.input.keyboard.createCursorKeys();

        hasBuilding = false;

        game.input.onDown.add(() => {
            tileGroup.forEach(function (tile) {
                let inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                if(inBounds){
                    if(game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
                        currentTile = 'testAsset';
                        tile = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, currentTile, 0, assetGroup);
                        tile.anchor.setTo(0.5, 0.226);
                    }
                    else if(game.input.keyboard.isDown(Phaser.Keyboard.TWO)){
                        currentTile = 'testAsset2';
                        const newTile = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, currentTile, 0, assetGroup);
                        newTile.anchor.setTo(0.5, 0.345);
                    }
                    else if(game.input.keyboard.isDown(Phaser.Keyboard.THREE)){
                        tile.selected = true;
                        currentTile = 'testAsset3';
                        const newTile = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, currentTile, 0, assetGroup);
                        newTile.anchor.setTo(0.5, 0.345);
                    }
                    else if(game.input.keyboard.isDown(Phaser.Keyboard.FOUR)){
                        currentTile = 'testAsset4';
                        const newTile = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, currentTile, 0, assetGroup);
                        newTile.anchor.setTo(0.5, 0.35);
                    }
                    else if(game.input.keyboard.isDown(Phaser.Keyboard.FIVE)){
                        currentTile = 'testAsset5';
                        const newTile = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, currentTile, 0, assetGroup);
                        newTile.anchor.setTo(0.5, 0.348);
                    }
                    else if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
                        tile.destroy();
                    }
                    else if(!tile.hasBuilding && game.input.keyboard.isDown(Phaser.Keyboard.B)){
                        const building = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, 'building', 0, assetGroup);
                        building.anchor.setTo(0.5, 0.5);
                        tile.hasBuilding = true;
                    }
                }
            });
            game.iso.simpleSort(assetGroup);
        });
    },
    update: function () {
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        tileGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                //game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                //game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });

        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }

        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }

    },
    render: function () {
        game.debug.text("Select Tile by Pressing the Associated Asset Number!", 100, 10, "#000000");
    },
    spawnTiles: function () {
        var tile, asset, text;
        for (var xx = 0; xx < 700; xx += 71) {
            for (var yy = 0; yy < 700; yy += 71) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, 'tiles', 0, tileGroup);
                tile.anchor.set(0.5, 0);
            }
        }
        for (var count = 0; count < 5; count++) {
            asset = game.add.tileSprite(screenTop, screenLeft + (45*count), 132, 83, assets[count]);
            asset.scale.setTo(0.5, 0.5);
            text = game.add.text(100, (45*count)+20, count+1, "#000000", textGroup);
            text.scale.setTo(0.5, 0.5);
        }
    }
};

game.state.add('Boot', InitGame.Boot);
game.state.start('Boot');
