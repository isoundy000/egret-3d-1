﻿module egret3d {
                            
    /**
     * @private
     * @language zh_CN
     * @class egret3d.Channel
     * @classdesc
     * VR 渲染视图。
     * @version Egret 3.0
     * @platform Web,Native
     */
    export class VRView3D extends View3D {

        private eyeMatrix: EyesMatrix;

        private leftViewPort: Rectangle = new Rectangle();
        private rightViewPort: Rectangle = new Rectangle();

        private _leftFrameBuffer: FrameBuffer;
        private _rightFrameBuffer: FrameBuffer;

        private _leftCanvas: PostCanvas;
        private _rightCanvas: PostCanvas;
   
        /**
        * @language zh_CN
        * 创建一个新的 VRView3D 对象。
        * @param viewPort {Rectangle} 显示区域
        * @version Egret 3.0
        * @platform Web,Native
        */                                     
        constructor(viewPort: Rectangle) {
            super(viewPort, new Camera3D(CameraType.VR));
            this.eyeMatrix = new EyesMatrix();

            this.leftViewPort.x = this.viewPort.x;
            this.leftViewPort.y = this.viewPort.y;
            this.leftViewPort.width = this.viewPort.width;
            this.leftViewPort.height = this.viewPort.height;

            this.rightViewPort.x = this.leftViewPort.width;
            this.rightViewPort.y = this.viewPort.y;
            this.rightViewPort.width = this.viewPort.width * 0.5;
            this.rightViewPort.height = this.viewPort.height;

            this.setupVR();
        }


        protected requestFrameBuffer() {
        }

        private setupVR() {
            if (this._isDeferred) {
            }
            else {
                this._leftCanvas = new PostCanvas("postCanvas_vertex", "warpedImage_fragment");
                this._rightCanvas = new PostCanvas("postCanvas_vertex", "warpedImage_fragment");

                this._leftCanvas.rectangle.x = 0;
                this._leftCanvas.rectangle.y = 0;
                this._leftCanvas.rectangle.width = 480;
                this._leftCanvas.rectangle.height = 480 / 512 * this.viewPort.height;

                this._rightCanvas.rectangle.x = 480 + 30;
                this._rightCanvas.rectangle.y = 0;
                this._rightCanvas.rectangle.width = 480;
                this._rightCanvas.rectangle.height = 480 / 512 * this.viewPort.height;

                this._leftCanvas.startWarped();
                this._rightCanvas.startWarped();

                this._leftFrameBuffer = RttManager.creatFrameBuffer(FrameBufferType.leftEyeFrameBuffer, this._context3D, 1024, 1024, FrameBufferFormat.UNSIGNED_BYTE_RGB);
                this._rightFrameBuffer = RttManager.creatFrameBuffer(FrameBufferType.rightEyeFrameBuffer, this._context3D, 1024, 1024, FrameBufferFormat.UNSIGNED_BYTE_RGB);
            }
        }

        /**
        * @language zh_CN
        * 设置眼睛空间
        * @param value {Number} Eyes Space。
        * @version Egret 3.0
        * @platform Web,Native
        */
        public setEyesSpace(value: number) {

            this._leftCanvas.x = 75;
            this._leftCanvas.y = 0;
            this._leftCanvas.width = 512;
            this._leftCanvas.height = 512;

            this._rightCanvas.x = 75;
            this._rightCanvas.y = 512 + value;
            this._rightCanvas.width = 512;
            this._rightCanvas.height = 512;
        }

        private tab: boolean = false;
        /**
        * @language zh_CN
        * 数据更新
        * @param time {Number} 当前时间
        * @param delay {Number} 间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        public update(time: number, delay: number) {

            super.updateViewSizeData();

            this._scene.collect.update(this._camera);

            this._context3D.gl.enable(Egret3DDrive.BLEND);
            this._context3D.gl.enable(Egret3DDrive.CULL_FACE)
            this._context3D.viewPort(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height);
            this._context3D.clear(0.0, 0.0, 0.0, 1.0);

            //this._root.rotationZ = 180;
            //this._root.rotationX = -90 ;
            //this._camera.tap(CameraType.perspective);

            // if (this.tab) {
            this.leftEye(time, delay);
            //      this.tab = false;
            // } else {
            this.rightEye(time, delay);
            //      this.tab = true;
            //   }

            this._context3D.viewPort(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height);

            this._leftCanvas.texture = this._leftFrameBuffer.texture;
            this._rightCanvas.texture = this._leftFrameBuffer.texture;

            this._leftCanvas.draw(this._context3D, this._viewPort);
            this._rightCanvas.draw(this._context3D, this._viewPort);


            for (var i: number = 0; i < this._hudList.length; i++) {
                this._hudList[i].draw(this._context3D);
            }

            this._context3D.gl.finish();

        }

        private leftEye(time: number, delay: number) {
            this._context3D.viewPort(this.leftViewPort.x, this.leftViewPort.y, this.leftViewPort.width, this.leftViewPort.height);
            this._camera.tap(CameraType.VR, VRType.left);
            this._context3D.setRenderToTexture(this._leftFrameBuffer.texture.texture, true, 0);
            if (this._sky) {
                this._sky.draw(this._context3D, this.camera3D);
            }
            if (this._sphereSky) {
                this._sphereSky.draw(this._context3D, this.camera3D);
            }
            this._context3D.clearDepth(1);
            this._render.draw(time, delay, this._context3D, this._scene.collect, this._camera, this._viewPort);
            this._context3D.setRenderToBackBuffer();
        }

        private rightEye(time: number, delay: number) {
            this._context3D.viewPort(this.rightViewPort.x, this.rightViewPort.y, this.rightViewPort.width, this.rightViewPort.height);
            this._camera.tap(CameraType.VR, VRType.right);
            this._context3D.setRenderToTexture(this._rightFrameBuffer.texture.texture, true, 0);
            if (this._sky) {
                this._sky.draw(this._context3D, this.camera3D);
            }
            if (this._sphereSky) {
                this._sphereSky.draw(this._context3D, this.camera3D);
            }
            this._context3D.clearDepth(1);
            this._render.draw(time, delay, this._context3D, this._scene.collect, this._camera, this._viewPort);
            this._context3D.setRenderToBackBuffer();

        }
    }
}