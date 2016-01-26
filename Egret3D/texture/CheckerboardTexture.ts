﻿module egret3d {

     /**
     * @language zh_CN
     * @class egret3d.CheckerboardTexture
     * @classdesc
     * CheckerboardTexture 类为 棋盘格纹理类</p>
     * 
     * 棋盘格纹理为黑白间隔色块组成的一张纹理，主要用于判别模型UV的正确性，若某模型UV值不正确，其纹理表现必定乱序不规整。</p>
     * 使用示例:</p>
      <pre>
     var material: egret3d.TextureMaterial = new egret3d.TextureMaterial(egret3d.CheckerboardTexture.texture );
     var mesh: egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), material);
      </pre>
     *
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample texture/CheckerboardTexture.ts
     */
    export class CheckerboardTexture extends TextureBase {

        /**
         * @language zh_CN
         * 公用棋盘格实例对象
         */
        public static texture: CheckerboardTexture = new CheckerboardTexture();
        private _width: number = 32;
        private _height: number = 32;
        private _pixelArray: Uint8Array;


        /**
         * @language zh_CN
         * 构造函数
         */
        constructor() {
            super();

            this.buildCheckerboard();

            this.mimapData = new Array<MipmapData>();
            this.mimapData.push(new MipmapData(this._pixelArray, this._width, this._height));
        }

        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D 
         */
        public upload(context3D: Context3D) {
            if (!this.texture) {
                this.texture = context3D.creatTexture2D();
                this.texture.gpu_border = 0; 
                this.texture.gpu_internalformat = InternalFormat.PixelArray;
                this.texture.gpu_colorformat = Egret3DDrive.ColorFormat_RGBA8888;
                this.texture.mipmapDatas = this.mimapData;
                this.useMipmap = false;
                context3D.upLoadTextureData(0, this.texture);
            }
        }

        private buildCheckerboard(): void {
            if (!this._pixelArray) {

                this._pixelArray = new Uint8Array(this._width * this._height * 4);

                var colors: egret3d.Color[] = [egret3d.Color.white(), egret3d.Color.black()];

                var colorIndex = 0;

                var blockSize: number = 4;

                for (var y: number = 0; y < this._height; y++) {
                    for (var x: number = 0; x < this._width; x++) {

                        if ((x % blockSize) == 0) {
                            colorIndex = (colorIndex + 1) % 2;
                        }

                        if ((y % blockSize) == 0 && x == 0) {
                            var tmp: egret3d.Color = colors[0];
                            colors[0] = colors[1];
                            colors[1] = tmp;
                            colorIndex = 0;
                        }

                        this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = colors[colorIndex].r;
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = colors[colorIndex].g;
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = colors[colorIndex].b;
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = colors[colorIndex].a;
                    }
                }
            }
        }
    }
}