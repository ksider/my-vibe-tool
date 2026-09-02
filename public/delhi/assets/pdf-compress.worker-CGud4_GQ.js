(function() {
	const t = {
		compress: !0,
		"compress-images": !0,
		"compress-fonts": !0,
		objstms: !0,
		"compression-effort": 100,
		garbage: "deduplicate"
	};
	function e(t, e, n) {
		const o = Math.max(t, e);
		if (!n || o <= n) return null;
		const s = n / o;
		return {
			w: Math.max(1, Math.round(t * s)),
			h: Math.max(1, Math.round(e * s))
		};
	}
	const n = new Function("u", "return import(u)");
	let o = null;
	self.onmessage = (s) => {
		(async function(s) {
			try {
				const { PDFDocument: a } = await (o ??= n("/mupdf/mupdf.js"), o), i = new a(new Uint8Array(s.bytes));
				let r = null;
				try {
					const n = s.options.recompressImages ? function(t, n, o) {
						const s = t.countObjects();
						let a = 0;
						for (let i = 1; i < s; i++) {
							const s = t.newIndirect(i);
							if (!s.isStream()) continue;
							const r = s.get("Subtype");
							if (!r.isName() || "Image" !== r.asName()) continue;
							const u = s.get("ImageMask");
							if (u.isBoolean() && u.asBoolean()) continue;
							if (!s.get("SMask").isNull()) continue;
							let c = null, m = null, g = null;
							try {
								c = t.loadImage(s), m = c.toPixmap();
								const i = e(m.getWidth(), m.getHeight(), o), r = i ? g = m.warp([
									[0, 0],
									[m.getWidth(), 0],
									[m.getWidth(), m.getHeight()],
									[0, m.getHeight()]
								], i.w, i.h) : m, u = 4 === r.getNumberOfComponents(), l = r.asJPEG(n, u), d = s.readRawStream(), f = d.getLength();
								if (d.destroy(), l.length >= f) continue;
								s.writeRawStream(l), s.put("Filter", t.newName("DCTDecode")), s.put("Width", r.getWidth()), s.put("Height", r.getHeight()), s.put("BitsPerComponent", 8), s.put("ColorSpace", t.newName(u ? "DeviceCMYK" : 1 === r.getNumberOfComponents() ? "DeviceGray" : "DeviceRGB")), s.delete("DecodeParms"), a++;
							} catch {} finally {
								g?.destroy(), m?.destroy(), c?.destroy();
							}
						}
						return a;
					}(i, Math.min(100, Math.max(1, Math.round(s.options.quality))), Math.max(0, Math.round(s.options.maxEdge))) : 0;
					i.subsetFonts(), r = i.saveToBuffer(t);
					const o = new Uint8Array(r.asUint8Array());
					self.postMessage({
						id: s.id,
						ok: !0,
						bytes: o.buffer,
						pageCount: i.countPages(),
						imagesTouched: n
					}, [o.buffer]);
				} finally {
					r?.destroy(), i.destroy();
				}
			} catch (a) {
				self.postMessage({
					id: s.id,
					ok: !1,
					error: String(a)
				});
			}
		})(s.data);
	};
})();
