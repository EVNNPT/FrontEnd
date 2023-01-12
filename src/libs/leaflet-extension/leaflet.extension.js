// Packaging/modules magic dance.
(function (factory) {
	var L;
	if (typeof define === "function" && define.amd) {
		// AMD
		define(["leaflet"], factory);
	} else if (typeof module !== "undefined") {
		// Node/CommonJS
		L = require("leaflet");
		module.exports = factory(L);
	} else {
		// Browser globals
		if (typeof window.L === "undefined") throw "Leaflet must be loaded first";
		factory(window.L);
	}
})(function (L) {
	("use strict");

	L.Renderer.include({
		_updateMayBienAp: function (layer) {
			const o1 = layer._xuLy(layer._getLatLngI1(), layer._getRadiusR1());
			const i1 = o1[0];
			const r1x = Math.max(Math.round(o1[1]), 1);
			const r1y = Math.max(Math.round(o1[2]), 1) || r1x;

			const o2 = layer._xuLy(layer._getLatLngI2(), layer._getRadiusR2());
			const i2 = o2[0];
			const r2x = Math.max(Math.round(o2[1]), 1);
			const r2y = Math.max(Math.round(o2[2]), 1) || r2x;

			const arc1 = "a" + r1x + "," + r1y + " 0 1,0 ";

			const arc2 = "a" + r2x + "," + r2y + " 0 1,0 ";

			const pA = layer._xuLy(layer._getLatLngA(), layer._getRadiusR1())[0];
			const pN = layer._xuLy(layer._getLatLngN(), layer._getRadiusR1())[0];
			const pB = layer._xuLy(layer._getLatLngB(), layer._getRadiusR1())[0];

			const arc3 =
				"M" +
				pA.x +
				" " +
				pA.y +
				" Q " +
				pN.x +
				" " +
				pN.y +
				" " +
				pB.x +
				" " +
				pB.y;

			var d = layer._empty()
				? "M0 0"
				: "M" +
				  (i1.x - r1x) +
				  "," +
				  i1.y +
				  arc1 +
				  r1x * 2 +
				  ",0 " +
				  arc1 +
				  -r1y * 2 +
				  ",0 " +
				  "M" +
				  (i2.x - r2x) +
				  "," +
				  i2.y +
				  arc2 +
				  r2x * 2 +
				  ",0 " +
				  arc2 +
				  -r2y * 2 +
				  ",0 " +
				  arc3;

			this._setPath(layer, d);
		},
	});

	//#region L.MayBienAp
	L.MayBienAp = L.Path.extend({
		options: {
			fill: false,
			chieuDai: 150,
			gocXoay: 0,
		},

		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this.cloneOptions();
			this._latlng = L.latLng(latlng);
		},

		// @method setLatLng(latLng: LatLng): this
		// Sets the position of a circle marker to a new location.
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			this.redraw();
			return this.fire("move", { latlng: this._latlng });
		},

		// @method getLatLng(): LatLng
		// Returns the current geographical position of the circle marker
		getLatLng: function () {
			return this._latlng;
		},

		_getRadiusR1: function () {
			return (
				(this.options.chieuDai * 4) / (2 + 3 * Math.sin(Math.acos(1 / 3)) * 4)
			);
		},

		_getLatLngI1: function () {
			return L.GeometryUtil.destination(
				this._latlng,
				this.options.gocXoay - 90,
				this._getRadiusR1() / 4
			);
		},

		_getRadiusR2: function () {
			return 0.6 * this._getRadiusR1();
		},

		_getLatLngI2: function () {
			return L.GeometryUtil.destination(
				this._getLatLngC(),
				this.options.gocXoay - 90,
				this._getRadiusR2()
			);
		},

		_getLatLngA: function () {
			return L.GeometryUtil.destination(
				this._latlng,
				this.options.gocXoay - 90,
				this.options.chieuDai / 2
			);
		},

		_getLatLngB: function () {
			return L.GeometryUtil.destination(
				this._getLatLngI1(),
				this.options.gocXoay,
				this._getRadiusR1()
			);
		},

		_getLatLngC: function () {
			return L.GeometryUtil.destination(
				this._latlng,
				this.options.gocXoay + 90,
				this.options.chieuDai / 2
			);
		},

		_getLatLngD: function () {
			return L.GeometryUtil.destination(
				this._getLatLngI1(),
				this.options.gocXoay + 180,
				this._getRadiusR1()
			);
		},

		_getLatLngE: function () {
			return L.GeometryUtil.destination(
				this._getLatLngI2(),
				this.options.gocXoay,
				this._getRadiusR2()
			);
		},

		_getLatLngF: function () {
			return L.GeometryUtil.destination(
				this._getLatLngI2(),
				this.options.gocXoay + 180,
				this._getRadiusR2()
			);
		},

		_getLatLngM: function () {
			const angleAB = L.GeometryUtil.angle(
				this._map,
				this._getLatLngA(),
				this._getLatLngB()
			);
			const d = this._getLatLngA().distanceTo(this._getLatLngB());
			return L.GeometryUtil.destination(this._getLatLngA(), angleAB, d / 2);
		},

		_getLatLngN: function () {
			const pM = this._getLatLngM();
			const pI1 = this._getLatLngI1();
			const angleMB = L.GeometryUtil.angle(this._map, pM, this._getLatLngB());
			const angleMI1 = L.GeometryUtil.angle(this._map, pM, pI1);
			const angleMBMI1 = angleMI1 - angleMB;
			const d = pM.distanceTo(pI1);
			const dI1AB = Math.sin((angleMBMI1 * Math.PI) / 180) * d;
			return L.GeometryUtil.destination(
				this._getLatLngM(),
				angleMB - 90,
				(3 * dI1AB) / 4
			);
		},

		getRotateMarker: function () {
			return L.GeometryUtil.destination(
				this._latlng,
				this.options.gocXoay,
				(3 * this._getRadiusR1()) / 2
			);
		},

		_xuLy: function (latlng, radius) {
			var lng = latlng.lng,
				lat = latlng.lat,
				map = this._map,
				crs = map.options.crs,
				retP,
				retRadiusX,
				retRadiusY;

			if (crs.distance === L.CRS.Earth.distance) {
				var d = Math.PI / 180,
					latR = radius / L.CRS.Earth.R / d,
					top = map.project([lat + latR, lng]),
					bottom = map.project([lat - latR, lng]),
					p = top.add(bottom).divideBy(2),
					lat2 = map.unproject(p).lat,
					lngR =
						Math.acos(
							(Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
								(Math.cos(lat * d) * Math.cos(lat2 * d))
						) / d;

				if (isNaN(lngR) || lngR === 0) {
					lngR = latR / Math.cos((Math.PI / 180) * lat); // Fallback for edge case, #2425
				}

				retP = p.subtract(map.getPixelOrigin());
				retRadiusX = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
				retRadiusY = p.y - top.y;
			} else {
				var latlng2 = crs.unproject(crs.project(latlng).subtract([radius, 0]));

				retP = map.latLngToLayerPoint(latlng);
				retRadiusX = retP.x - map.latLngToLayerPoint(latlng2).x;
				retRadiusY = radius;
			}

			return [retP, retRadiusX, retRadiusY];
		},

		_project: function () {
			this._updateBounds();
		},

		_updateBounds: function () {
			const bounds = this.getBounds();
			this._pxBounds = L.bounds(
				this._map.latLngToLayerPoint(bounds._northEast),
				this._map.latLngToLayerPoint(bounds._southWest)
			);
		},

		_update: function () {
			if (this._map) {
				this._updatePath();
			}
		},

		_updatePath: function () {
			this._renderer._updateMayBienAp(this);
		},

		_empty: function () {
			return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
		},

		// Needed by the `Canvas` renderer for interactivity
		_containsPoint: function (p) {
			return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
		},

		// @method getBounds(): LatLngBounds
		// Returns the `LatLngBounds` of the path.
		getBounds: function () {
			const pA = this._getLatLngA();
			const pC = this._getLatLngC();

			return L.latLngBounds(
				L.GeometryUtil.destination(
					pC,
					-this.options.gocXoay,
					this._getRadiusR1()
				),
				L.GeometryUtil.destination(
					pA,
					this.options.gocXoay + 180,
					this._getRadiusR1()
				)
			);
		},
		rotate: function (latlng) {
			const map = this._map;
			const centerPoint = this._latlng;
			const angle = L.GeometryUtil.angle(map, centerPoint, latlng);
			this.options.gocXoay = angle;
			this.redraw();
		},
		resize: function (latlng) {
			const map = this._map;
			const pC = this._getLatLngC();
			const centerPoint = this._latlng;
			const angleMC = L.GeometryUtil.angle(map, centerPoint, pC);
			const angleMCDetal = L.GeometryUtil.angle(map, centerPoint, latlng);
			const angle = Math.abs(angleMCDetal - angleMC);
			const d =
				Math.cos((angle * Math.PI) / 180) * centerPoint.distanceTo(latlng);
			this.options.chieuDai = Math.abs(2 * d);
			this.redraw();
		},
		move: function (latlng) {
			this._latlng = latlng;
			this.redraw();
		},
		cloneOptions: function () {
			this.optionsClone = {
				gocXoay: this.options.gocXoay,
				chieuDai: this.options.chieuDai,
			};
		},
	});

	L.mayBienAp = function (latlng, options) {
		return new L.MayBienAp(latlng, options);
	};
	//#endregion

	// Thêm hàm/thuộc tính vào lớp Layer đã tồn tại.
	L.Layer.include({
		// Hàm trả về centerPoint của layer
		getCenterCus: function () {
			const pNE = this._map.project(
				this._bounds._northEast,
				this._map.getZoom()
			);
			const pSW = this._map.project(
				this._bounds._southWest,
				this._map.getZoom()
			);
			return this._map.unproject(
				L.point((pNE.x + pSW.x) / 2, (pNE.y + pSW.y) / 2),
				this._map.getZoom()
			);
		},
	});

	//#region L.ThanhCai
	L.ThanhCai = L.Polyline.extend({
		options: {
			chieuDai: 300,
			gocXoay: 0,
			distanceRotateMarker: 20,
		},
		initialize: function (centerPoint, options) {
			L.setOptions(this, options);
			this.cloneOptions();
			const latlngs = this._thanhCaiLatLngs(centerPoint);
			L.Polyline.prototype.initialize.call(this, latlngs, options);
		},
		_thanhCaiLatLngs: function (centerPoint) {
			const gocXoayA = this.options.gocXoay;
			const gocXoayB = gocXoayA + 180;
			const diemA = L.GeometryUtil.destination(
				centerPoint,
				gocXoayA,
				this.options.chieuDai / 2
			);
			const diemB = L.GeometryUtil.destination(
				centerPoint,
				gocXoayB,
				this.options.chieuDai / 2
			);
			return [diemA, diemB];
		},
		getRotateMarker: function () {
			const centerPoint = this.getCenterCus();
			return L.GeometryUtil.destination(
				centerPoint,
				this.options.gocXoay - 90,
				this.options.distanceRotateMarker
			);
		},
		rotate: function (latlng) {
			const map = this._map;
			const centerPoint = this.getCenterCus();
			const angle = L.GeometryUtil.angle(map, centerPoint, latlng);
			this.options.gocXoay = angle + 90;
			this.setLatLngs(this._thanhCaiLatLngs(centerPoint));
		},
		resize: function (latlng) {
			const map = this._map;
			const latLngs = this.getLatLngs();
			const centerPoint = this.getCenterCus();
			const pA = latLngs[0];
			const angleMA = L.GeometryUtil.angle(map, centerPoint, pA);
			const angleMADetal = L.GeometryUtil.angle(map, centerPoint, latlng);
			const angle = Math.abs(angleMADetal - angleMA);
			const d =
				Math.cos((angle * Math.PI) / 180) * centerPoint.distanceTo(latlng);
			this.options.chieuDai = Math.abs(2 * d);
			this.setLatLngs(this._thanhCaiLatLngs(centerPoint));
		},
		move: function (latlng) {
			this.setLatLngs(this._thanhCaiLatLngs(latlng));
		},
		cloneOptions: function () {
			this.optionsClone = {
				gocXoay: this.options.gocXoay,
				chieuDai: this.options.chieuDai,
			};
		},
	});

	L.thanhCai = function (latlng, map, options) {
		return new L.ThanhCai(latlng, map, options);
	};
	//#endregion

	//#region L.Role
	L.Role = L.Polyline.extend({
		options: {
			chieuDai: 50,
			chieuRong: 25,
			gocXoay: 0,
		},
		initialize: function (centerPoint, options) {
			L.setOptions(this, options);
			this.cloneOptions();
			const latlngs = this._roleLatLngs(centerPoint);
			L.Polyline.prototype.initialize.call(this, latlngs, options);
		},
		_roleLatLngs: function (centerPoint) {
			const gocXoayM = -this.options.gocXoay;
			const gocXoayA = -90 - this.options.gocXoay;
			const gocXoayB = gocXoayA + 180;
			const gocXoayC = 180 + gocXoayM;
			const gocXoayD = 180 + gocXoayM;
			const trungDiemAB = L.GeometryUtil.destination(
				centerPoint,
				-gocXoayM,
				this.options.chieuRong / 2
			);
			const diemA = L.GeometryUtil.destination(
				trungDiemAB,
				-gocXoayA,
				this.options.chieuDai / 2
			);
			const diemB = L.GeometryUtil.destination(
				trungDiemAB,
				-gocXoayB,
				this.options.chieuDai / 2
			);
			const diemC = L.GeometryUtil.destination(
				diemB,
				-gocXoayC,
				this.options.chieuRong
			);
			const diemD = L.GeometryUtil.destination(
				diemA,
				-gocXoayD,
				this.options.chieuRong
			);
			return [diemA, diemB, diemC, diemD, diemA];
		},
		getRotateMarker: function () {
			const centerPoint = this.getCenterCus();
			return L.GeometryUtil.destination(
				centerPoint,
				this.options.gocXoay,
				this.options.chieuRong
			);
		},
		move: function (latlng) {
			this.setLatLngs(this._roleLatLngs(latlng));
		},
		resize: function (latlng) {
			const latLngs = this.getLatLngs();
			const centerPoint = this.getCenterCus();
			const map = this._map;
			const pA = latLngs[0];
			const pB = latLngs[1];
			const pD = latLngs[3];
			const trungDiemAB = L.GeometryUtil.closestOnSegment(
				map,
				centerPoint,
				pA,
				pB
			);
			const trungDiemAD = L.GeometryUtil.closestOnSegment(
				map,
				centerPoint,
				pA,
				pD
			);
			const angleMAB_A = L.GeometryUtil.angle(map, trungDiemAB, pA);
			const angleMAD_A = L.GeometryUtil.angle(map, trungDiemAD, pA);
			const angleMAB_ADetal = L.GeometryUtil.angle(map, trungDiemAB, latlng);
			const angleMAD_ADetal = L.GeometryUtil.angle(map, trungDiemAD, latlng);
			const angleA = Math.abs(angleMAB_ADetal - angleMAB_A);
			const angleB = Math.abs(angleMAD_ADetal - angleMAD_A);
			const dxAB =
				Math.cos((angleA * Math.PI) / 180) * trungDiemAB.distanceTo(latlng);
			const dxAD =
				Math.cos((angleB * Math.PI) / 180) * trungDiemAD.distanceTo(latlng);
			this.options.chieuDai = Math.abs(this.options.chieuDai / 2 + dxAB);
			this.options.chieuRong = Math.abs(this.options.chieuRong / 2 + dxAD);
			this.setLatLngs(this._roleLatLngs(centerPoint));
		},
		rotate: function (latlng) {
			const map = this._map;
			const centerPoint = this.getCenterCus();
			const angle = L.GeometryUtil.angle(map, centerPoint, latlng);
			this.options.gocXoay = angle;
			this.setLatLngs(this._roleLatLngs(centerPoint));
		},
		cloneOptions: function () {
			this.optionsClone = {
				chieuDai: this.options.chieuDai,
				chieuRong: this.options.chieuRong,
				gocXoay: this.options.gocXoay,
			};
		},
	});

	L.role = function (latlng, options) {
		return new L.Role(latlng, options);
	};
	//#endregion

	//#region L.TransfromDevice
	/**
	 * @class L.TransfromDevice
	 * @aka TransfromDevice
	 *
	 * Xoay các thiết bị...
	 *
	 * @example
	 *
	 * ```js
	 *    const transfromDevice = L.transfromDevice(map, {...});
	 *    transfromDevice.rotateMayBienAp(latlngs, centerPoint, angle);
	 * ```
	 */
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

	L.transfromDevice = function (map, options) {
		return new L.TransfromDevice(map, options);
	};

	//#endregion

	//#region L.DrawDevice
	/**
	 * @class L.DrawDevice
	 * @aka DrawDevice
	 *
	 * Vẽ các thiết bị: Rơ le, thanh cái...
	 *
	 * @example
	 *
	 * ```js
	 *    const drawDevice = L.drawDevice(map, {...});
	 *    drawDevice.drawThanhCai(latlng);
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

		initialize: function (map, options) {
			this.map = map;
			L.setOptions(this, options);
		},

		// @method drawThanhCai()
		// Vẽ thanh cái:
		//  + Vẽ đường thẳng gồm 3 điểm A, B, C với B là trung điểm của AC.
		//  + Độ dài và styles lấy từ biến options.
		drawThanhCai: function (latlng) {
			const map = this.map;
			const zoom = map.getZoom();
			const pG = map.project(latlng, zoom);
			const pDraw = this.options.thanhCai;
			console.log(pDraw);
			const dX = this._disToPixeldistance(pDraw.length);

			const pA = L.point(pG.x - dX / 2, pG.y);
			const pB = pG;
			const pC = L.point(pG.x + dX / 2, pG.y);

			// const pA = L.point(pG.x, pG.y - dX / 2);
			// const pB = pG;
			// const pC = L.point(pG.x, pG.y + dX / 2);

			const lA = map.unproject(pA, map.getZoom());
			const lB = map.unproject(pB, map.getZoom());
			const lC = map.unproject(pC, map.getZoom());

			return L.thanhCai([lA, lB, lC]);
		},

		// @method drawRole()
		// Vẽ rơ le:
		//  + Vẽ hình chữ nhật ABCD.
		//  + Chiều dài, chiều rộng và styles lấy từ biến options.
		drawRole: function (latlng) {
			const map = this.map;
			const zoom = map.getZoom();
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
			return L.role([lA, lB, lC, lD, lA]);
		},

		// @method drawMayBienAp
		// Vẽ máy biến áp:
		//  + Vẽ hai đường tròn: Đường tròn lớn (I1, r1) và đường tròn nhỏ (I2, r2)
		drawMayBienAp: function (latlng) {
			const map = this.map;
			const zoom = map.getZoom();
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

	L.drawDevice = function (map, options) {
		return new L.DrawDevice(map, options);
	};

	//#endregion

	//#region L.DrawExtUtil
	/**
	 * @class L.DrawExtUtil
	 * @aka DrawExtUtil
	 *
	 * ...
	 *
	 * @example
	 *
	 * ```js
	 *    const drawExtUtil = L.drawExtUtil(map, {...});
	 *    drawExtUtil.getSnapPoints(latlng);
	 * ```
	 */
	L.DrawExtUtil = L.Class.extend({
		initialize: function (map) {
			this.map = map;
		},

		getSnapPoints: function (layer) {
			const bounds = layer.getBounds();
			const zoom = this.map.getZoom();
			const pB = this.map.project(bounds._northEast, zoom);
			const pD = this.map.project(bounds._southWest, zoom);

			const pC = L.point(pB.x, pD.y);
			const pA = L.point(pD.x, pB.y);

			const pMAB = L.point((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
			const pMCD = L.point((pC.x + pD.x) / 2, (pC.y + pD.y) / 2);
			const pMBC = L.point((pC.x + pB.x) / 2, (pC.y + pB.y) / 2);
			const pMDA = L.point((pA.x + pD.x) / 2, (pA.y + pD.y) / 2);
			const uPrjMAB = this.map.unproject(pMAB, zoom);
			const uPrjMCD = this.map.unproject(pMCD, zoom);
			const uPrjMBC = this.map.unproject(pMBC, zoom);
			const uPrjMDA = this.map.unproject(pMDA, zoom);
			return [uPrjMAB, uPrjMCD, uPrjMBC, uPrjMDA];
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

	L.drawExtUtil = function (map) {
		return new L.DrawExtUtil(map);
	};
	//#endregion
});
