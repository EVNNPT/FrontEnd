(function (window, document, undefined) {
  L.TransfromDevice = L.Class.extend({
    initialize: function (map, options) {
      this.map = map;
      L.setOptions(this, options);
    },

    // @method rotateMayBienAp(latlngs, angle): latlngs
    rotateMayBienAp: function (latlngs, centerPoint, angle) {
      // Lấy thông tin map, tỉ lệ zoom hiện tại
      const map = this.map;
      const zoom = map.getZoom();

      // Chiếu lấy tọa độ x,y
      // Vòng tròn I1
      var prjI1s = [];
      for (var i = 0; i < latlngs[0].length; i++) {
        prjI1s.push(map.project(latlngs[0][i], zoom));
      }
      // Vòng tròn I2
      var prjI2s = [];
      for (var i = 0; i < latlngs[1].length; i++) {
        prjI2s.push(map.project(latlngs[1][i], zoom));
      }
      // Center Point
      const prjCenterPoint = map.project(centerPoint, zoom);

      // Xoay góc angle quanh điểm centerPoint
      // Vòng tròn I1
      var rI1s = [];
      for (var i = 0; i < prjI1s.length; i++) {
        rI1s.push(this._rotatePoint(prjI1s[i], prjCenterPoint, angle));
      }
      // Vòng tròn I2
      var rI2s = [];
      for (var i = 0; i < prjI2s.length; i++) {
        rI2s.push(this._rotatePoint(prjI2s[i], prjCenterPoint, angle));
      }

      // Chiếu lấy tọa độ latLng
      // Vòng tròn I1
      var uPrjI1s = [];
      for (var i = 0; i < rI1s.length; i++) {
        uPrjI1s.push(map.unproject(rI1s[i], zoom));
      }
      // Vòng tròn I2
      var uPrjI2s = [];
      for (var i = 0; i < rI2s.length; i++) {
        uPrjI2s.push(map.unproject(rI2s[i], zoom));
      }

      return L.polyline([uPrjI1s, uPrjI2s]);
    },

    // @method rotateThanhCai(latlngs, angle): latlngs
    // Thanh cái xác định bởi ba điểm (pA, pB, pC) với pB là trung điểm.
    // Xoay thanh cái một góc angle (đơn vị: độ). => Xoay hai điểm pA và pC quanh pB.
    rotateThanhCai: function (latlngs, centerPoint, angle) {
      // Lấy thông tin map, tỉ lệ zoom hiện tại
      const map = this.map;
      const zoom = map.getZoom();

      // Lấy tọa độ latLng
      const pA = new L.latLng(latlngs[0]);
      const pB = centerPoint;
      const pC = new L.latLng(latlngs[2]);

      // Chiếu lấy tọa độ x,y
      const prjA = map.project(pA, zoom);
      const prjB = map.project(pB, zoom);
      const prjC = map.project(pC, zoom);

      // Xoay góc angle quanh điểm prjB
      const rA = this._rotatePoint(prjA, prjB, angle);
      const rC = this._rotatePoint(prjC, prjB, angle);

      // Chiếu lấy tọa độ latLng
      const lA = map.unproject(rA, zoom);
      const lC = map.unproject(rC, zoom);

      // Trả về dữ liệu
      return L.polyline([lA, pB, lC]);
    },

    // @method rotateRole(latlngs, angle): latlngs
    rotateRole: function (latlngs, centerPoint, angle) {
      // Lấy thông tin map, tỉ lệ zoom hiện tại
      const map = this.map;
      const zoom = map.getZoom();

      // Lấy tọa độ latLng
      const pA = new L.latLng(latlngs[0][0]);
      const pB = new L.latLng(latlngs[0][1]);
      const pC = new L.latLng(latlngs[1][1]);
      const pD = new L.latLng(latlngs[2][1]);

      // Chiếu lấy tọa độ x,y
      const prjA = map.project(pA, zoom);
      const prjB = map.project(pB, zoom);
      const prjC = map.project(pC, zoom);
      const prjD = map.project(pD, zoom);

      const prjMidLatLng = map.project(centerPoint, zoom);

      // Xoay góc angle quanh điểm prjB
      const rA = this._rotatePoint(prjA, prjMidLatLng, angle);
      const rB = this._rotatePoint(prjB, prjMidLatLng, angle);
      const rC = this._rotatePoint(prjC, prjMidLatLng, angle);
      const rD = this._rotatePoint(prjD, prjMidLatLng, angle);

      // Chiếu lấy tọa độ latLng
      const lA = map.unproject(rA, zoom);
      const lB = map.unproject(rB, zoom);
      const lC = map.unproject(rC, zoom);
      const lD = map.unproject(rD, zoom);

      // Trả về dữ liệu
      return L.polyline([
        [lA, lB],
        [lB, lC],
        [lC, lD],
        [lD, lA],
      ]);
    },

    // @method _rotatePoint(point, midPoint, angle): L.point
    // Xoay một điểm (param: point) một góc angle xung quanh một điểm gốc (param: midPoint),
    // theo chiều kim đồng hồ.
    _rotatePoint: function (point, midPoint, angle) {
      const piDiv180 = Math.PI / 180;
      const r = angle * piDiv180;

      const ox = point.x - midPoint.x;
      const oy = point.y - midPoint.y;

      const cosr = Math.cos(r);
      const sinr = Math.sin(r);

      const dx = ox * cosr + oy * sinr;
      const dy = -ox * sinr + oy * cosr;

      return L.point(dx + midPoint.x, dy + midPoint.y);
    },
  });

  /**
   * @class L.DrawDevice
   * @aka DrawDevice
   *
   * Vẽ các thiết bị: Rơ le, thanh cái...
   *
   * @example
   *
   * ```js
   *    const drawDevice = L.DrawDevice(map, mainPoint, {...});
   *    drawDevice.drawThanhCai();
   * ```
   */
  L.DrawDevice = L.Class.extend({
    options: {
      thanhCai: {
        length: 300,
        styles: {
          color: "#52967a",
          weight: 8,
          lineCap: "square",
        },
      },
      role: {
        width: 50,
        height: 25,
        styles: {
          color: "#52967a",
          weight: 5,
          lineCap: "square",
        },
      },
      mayBienAp: {
        dGI1: 65,
        dGI2: 50,
        rI1: 95,
        rI2: 60,
        styles: {
          color: "#52967a",
          weight: 5,
          lineCap: "square",
        },
      },
    },

    initialize: function (map, mainPoint, options) {
      this.map = map;
      this.mainPoint = mainPoint;
      L.setOptions(this, options);
    },

    // @method drawThanhCai()
    // Vẽ thanh cái:
    //  + Vẽ đường thẳng gồm 3 điểm A, B, C với B là trung điểm của AC.
    //  + Độ dài và styles lấy từ biến options.
    drawThanhCai: function (latlng) {
      const map = this.map;
      const zoom = map.getZoom();
      latlng = latlng || this.mainPoint;
      const pG = map.project(latlng, zoom);
      const pDraw = this.options.thanhCai;
      const dX = this._disToPixeldistance(pDraw.length);

      const pA = L.point(pG.x - dX / 2, pG.y);
      const pB = pG;
      const pC = L.point(pG.x + dX / 2, pG.y);

      const lA = map.unproject(pA, map.getZoom());
      const lB = map.unproject(pB, map.getZoom());
      const lC = map.unproject(pC, map.getZoom());

      return L.polyline([lA, lB, lC]);
    },

    // @method drawRole()
    // Vẽ rơ le:
    //  + Vẽ hình chữ nhật ABCD.
    //  + Chiều dài, chiều rộng và styles lấy từ biến options.
    drawRole: function (latlng) {
      const map = this.map;
      const zoom = map.getZoom();
      latlng = latlng || this.mainPoint;
      const pG = map.project(latlng, zoom);
      const pDraw = this.options.role;
      const dY = this._disToPixeldistance(pDraw.width);
      const dX = this._disToPixeldistance(pDraw.height);
      const pA = L.point(pG.x - dX / 2, pG.y + dY / 2);
      const pB = L.point(pG.x + dX / 2, pG.y + dY / 2);
      const pC = L.point(pG.x + dX / 2, pG.y - dY / 2);
      const pD = L.point(pG.x - dX / 2, pG.y - dY / 2);
      const lA = map.unproject(pA, map.getZoom());
      const lB = map.unproject(pB, map.getZoom());
      const lC = map.unproject(pC, map.getZoom());
      const lD = map.unproject(pD, map.getZoom());
      return L.polyline([
        [lA, lB],
        [lB, lC],
        [lC, lD],
        [lD, lA],
      ]);
    },

    // @method drawMayBienAp
    // Vẽ máy biến áp:
    //  + Vẽ hai đường tròn: Đường tròn lớn (I1, r1) và đường tròn nhỏ (I2, r2)
    drawMayBienAp: function (latlng) {
      const map = this.map;
      const zoom = map.getZoom();
      latlng = latlng || this.mainPoint;
      const pG = map.project(latlng, zoom);
      const pDraw = this.options.mayBienAp;

      // Bán kính đường tròn lớn
      const rI1 = this._disToPixeldistance(pDraw.rI1);
      // Khoảng cách từ tâm đường tròn lớn tới pG (điểm con trỏ chuột).
      const dGI1 = this._disToPixeldistance(pDraw.dGI1);
      // Bán kính đường tròn nhỏ
      const rI2 = this._disToPixeldistance(pDraw.rI2);
      // Khoảng cách từ tâm đường nhỏ lớn tới pG (điểm con trỏ chuột).
      const dGI2 = this._disToPixeldistance(pDraw.dGI2);

      const pI1 = L.point(pG.x - dGI1, pG.y);
      const pI2 = L.point(pG.x + dGI2, pG.y);

      return L.polyline([
        this._genPointOfCircle(pI1, rI1),
        this._genPointOfCircle(pI2, rI2),
      ]);
    },

    // @method _disToPixeldistance(distance, zoom)
    // Đổi độ dài từ đơn vị mét ra pixel, theo mức zoom của bản đồ.
    _disToPixeldistance: function (distance, zoom) {
      const map = this.map;
      zoom = zoom || map.getZoom();
      const center = map.getCenter();
      const l2 = L.GeometryUtil.destination(center, 90, distance);
      const p1 = map.project(center, zoom);
      const p2 = map.project(l2, zoom);
      return p1.distanceTo(p2);
    },

    // @method _genPointOfCircle
    _genPointOfCircle: function (pI, r) {
      var points = [];
      const zoom = this.map.getZoom();
      for (var a = 0; a <= 2 * Math.PI; a += 0.1) {
        const x = pI.x + r * Math.cos(a);
        const y = pI.y + r * Math.sin(a);
        points.push(this.map.unproject(L.point(x, y), zoom));
      }
      points.push(points[0]);
      return points;
    },
  });

  L.DrawExtUtil = L.Class.extend({
    initialize: function (map) {
      this.map = map;
    },

    getCenterPoint: function (layer) {
      const bounds = layer.getBounds();
      const zoom = this.map.getZoom();
      const pA = this.map.project(bounds._northEast, zoom);
      const pB = this.map.project(bounds._southWest, zoom);
      const pM = L.point((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
      const uPrjM = this.map.unproject(pM, zoom);
      return uPrjM;
    },
  });
})(window, document);
