﻿module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.CylinderGeometry
     * @classdesc
     * CylinderGeometry类 表示圆柱体</p>
     *
     * 示例：</p>
     * 用 CylinderGeometry 对象创建一个mesh，并给予默认纹理材质TextureMaterial（默认为棋盘格纹理)</p>
     <pre>
     var box: egret3d.Mesh = new egret3d.Mesh( new egret3d.CylinderGeometry(), new egret3d.TextureMaterial() );
     </pre>
     * 
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/CylinderGeometry.ts
     */
    export class CylinderGeometry extends SubGeometry {

        /**
        * @language zh_CN
        * 构造函数
        */
        constructor() {
            super();

            this.buildGeomtry();
        }
                                                
        /**
        * @language zh_CN
        * 生成网格
        */
        public buildGeomtry() {

            var vertices = new Array<number>();

            var vertexIndices = new Array<number>();

            var m_nSegments: number = 10;
            var m_rRadius: number = 10;
            var m_rHeight: number = 60;

            var nCurrentSegment: number = 10;

            var  rDeltaSegAngle: number  = (2.0 * Math.PI / m_nSegments);
            var rSegmentLength: number  = 1.0  / m_nSegments;

            for (nCurrentSegment = 0; nCurrentSegment <= m_nSegments; nCurrentSegment++)
            {
                var x0: number = m_rRadius * Math.sin(nCurrentSegment * rDeltaSegAngle);

                var z0: number  = m_rRadius * Math.cos(nCurrentSegment * rDeltaSegAngle);

                vertices.push(
                    x0, 0.0 + (m_rHeight / 2.0), z0, x0, 0.0, z0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                    x0, 0.0 - (m_rHeight / 2.0), z0, x0, 0.0, z0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            }

            vertices.push(0.0, 0.0  + (m_rHeight / 2.0), 0.0, 0.0, 1.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);

            for (nCurrentSegment = 0; nCurrentSegment <= m_nSegments; nCurrentSegment++)
            {
                var  x0: number  = m_rRadius * Math.sin(nCurrentSegment * rDeltaSegAngle);
                var z0: number  = m_rRadius * Math.cos(nCurrentSegment * rDeltaSegAngle);

                //float tu0 = (0.5f * sinf(nCurrentSegment * rDeltaSegAngle)) + 0.5f;
                //float tv0 = (0.5f * cosf(nCurrentSegment * rDeltaSegAngle)) + 0.5f;

                vertices.push(x0, 0.0  + (m_rHeight / 2.0), z0, 0.0, 1.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            }

            vertices.push(0.0, 0.0 - (m_rHeight / 2.0), 0.0, 0.0, -1.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);

            for (nCurrentSegment = m_nSegments; nCurrentSegment >= 0; nCurrentSegment--)
            {
                var  x0: number  = m_rRadius * Math.sin(nCurrentSegment * rDeltaSegAngle);
                var z0: number  = m_rRadius * Math.cos(nCurrentSegment * rDeltaSegAngle);

                vertices.push(x0, 0.0 - (m_rHeight / 2.0), z0, 0.0, -1.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
             }

            this.setGeomtryData(vertexIndices, vertices);
        }
    }
} 