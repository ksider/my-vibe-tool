(function() {
	var t = class t {
		static read_bytes(e, n) {
			const r = new t();
			return r.buf = e.getUint32(n, !0), r.buf_len = e.getUint32(n + 4, !0), r;
		}
		static read_bytes_array(e, n, r) {
			const s = [];
			for (let i = 0; i < r; i++) s.push(t.read_bytes(e, n + 8 * i));
			return s;
		}
	}, e = class t {
		static read_bytes(e, n) {
			const r = new t();
			return r.buf = e.getUint32(n, !0), r.buf_len = e.getUint32(n + 4, !0), r;
		}
		static read_bytes_array(e, n, r) {
			const s = [];
			for (let i = 0; i < r; i++) s.push(t.read_bytes(e, n + 8 * i));
			return s;
		}
	}, n = class {
		head_length() {
			return 24;
		}
		name_length() {
			return this.dir_name.byteLength;
		}
		write_head_bytes(t, e) {
			t.setBigUint64(e, this.d_next, !0), t.setBigUint64(e + 8, this.d_ino, !0), t.setUint32(e + 16, this.dir_name.length, !0), t.setUint8(e + 20, this.d_type);
		}
		write_name_bytes(t, e, n) {
			t.set(this.dir_name.slice(0, Math.min(this.dir_name.byteLength, n)), e);
		}
		constructor(t, e, n, r) {
			const s = new TextEncoder().encode(n);
			this.d_next = t, this.d_ino = e, this.d_namlen = s.byteLength, this.d_type = r, this.dir_name = s;
		}
	}, r = class {
		write_bytes(t, e) {
			t.setUint8(e, this.fs_filetype), t.setUint16(e + 2, this.fs_flags, !0), t.setBigUint64(e + 8, this.fs_rights_base, !0), t.setBigUint64(e + 16, this.fs_rights_inherited, !0);
		}
		constructor(t, e) {
			this.fs_rights_base = 0n, this.fs_rights_inherited = 0n, this.fs_filetype = t, this.fs_flags = e;
		}
	}, s = class {
		write_bytes(t, e) {
			t.setBigUint64(e, this.dev, !0), t.setBigUint64(e + 8, this.ino, !0), t.setUint8(e + 16, this.filetype), t.setBigUint64(e + 24, this.nlink, !0), t.setBigUint64(e + 32, this.size, !0), t.setBigUint64(e + 38, this.atim, !0), t.setBigUint64(e + 46, this.mtim, !0), t.setBigUint64(e + 52, this.ctim, !0);
		}
		constructor(t, e, n) {
			this.dev = 0n, this.nlink = 0n, this.atim = 0n, this.mtim = 0n, this.ctim = 0n, this.ino = t, this.filetype = e, this.size = n;
		}
	}, i = class t {
		static read_bytes(e, n) {
			return new t(e.getBigUint64(n, !0), e.getUint8(n + 8), e.getUint32(n + 16, !0), e.getBigUint64(n + 24, !0), e.getUint16(n + 36, !0));
		}
		constructor(t, e, n, r, s) {
			this.userdata = t, this.eventtype = e, this.clockid = n, this.timeout = r, this.flags = s;
		}
	}, o = class {
		write_bytes(t, e) {
			t.setBigUint64(e, this.userdata, !0), t.setUint16(e + 8, this.error, !0), t.setUint8(e + 10, this.eventtype);
		}
		constructor(t, e, n) {
			this.userdata = t, this.error = e, this.eventtype = n;
		}
	}, a = class {
		write_bytes(t, e) {
			t.setUint32(e, this.pr_name.byteLength, !0);
		}
		constructor(t) {
			this.pr_name = new TextEncoder().encode(t);
		}
	}, l = class t {
		static dir(e) {
			const n = new t();
			return n.tag = 0, n.inner = new a(e), n;
		}
		write_bytes(t, e) {
			t.setUint32(e, this.tag, !0), this.inner.write_bytes(t, e + 4);
		}
	};
	const f = new class {
		enable(t) {
			this.log = function(t, e) {
				return t ? console.log.bind(console, "%c%s", "color: #265BA0", e) : () => {};
			}(void 0 === t || t, this.prefix);
		}
		get enabled() {
			return this.isEnabled;
		}
		constructor(t) {
			this.isEnabled = t, this.prefix = "wasi:", this.enable(t);
		}
	}(!1);
	var d = class extends Error {
		constructor(t) {
			super("exit with exit code " + t), this.code = t;
		}
	};
	let u = class {
		start(t) {
			this.inst = t;
			try {
				return t.exports._start(), 0;
			} catch (e) {
				if (e instanceof d) return e.code;
				throw e;
			}
		}
		initialize(t) {
			this.inst = t, t.exports._initialize && t.exports._initialize();
		}
		constructor(n, r, s, a = {}) {
			this.args = [], this.env = [], this.fds = [], f.enable(a.debug), this.args = n, this.env = r, this.fds = s;
			const l = this;
			this.wasiImport = {
				args_sizes_get(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer);
					n.setUint32(t, l.args.length, !0);
					let r = 0;
					for (const s of l.args) r += s.length + 1;
					return n.setUint32(e, r, !0), f.log(n.getUint32(t, !0), n.getUint32(e, !0)), 0;
				},
				args_get(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer), r = new Uint8Array(l.inst.exports.memory.buffer), s = e;
					for (let i = 0; i < l.args.length; i++) {
						n.setUint32(t, e, !0), t += 4;
						const s = new TextEncoder().encode(l.args[i]);
						r.set(s, e), n.setUint8(e + s.length, 0), e += s.length + 1;
					}
					return f.enabled && f.log(new TextDecoder("utf-8").decode(r.slice(s, e))), 0;
				},
				environ_sizes_get(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer);
					n.setUint32(t, l.env.length, !0);
					let r = 0;
					for (const s of l.env) r += new TextEncoder().encode(s).length + 1;
					return n.setUint32(e, r, !0), f.log(n.getUint32(t, !0), n.getUint32(e, !0)), 0;
				},
				environ_get(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer), r = new Uint8Array(l.inst.exports.memory.buffer), s = e;
					for (let i = 0; i < l.env.length; i++) {
						n.setUint32(t, e, !0), t += 4;
						const s = new TextEncoder().encode(l.env[i]);
						r.set(s, e), n.setUint8(e + s.length, 0), e += s.length + 1;
					}
					return f.enabled && f.log(new TextDecoder("utf-8").decode(r.slice(s, e))), 0;
				},
				clock_res_get(t, e) {
					let n;
					switch (t) {
						case 1:
							n = 5000n;
							break;
						case 0:
							n = 1000000n;
							break;
						default: return 52;
					}
					return new DataView(l.inst.exports.memory.buffer).setBigUint64(e, n, !0), 0;
				},
				clock_time_get(t, e, n) {
					const r = new DataView(l.inst.exports.memory.buffer);
					if (0 === t) r.setBigUint64(n, 1000000n * BigInt((/* @__PURE__ */ new Date()).getTime()), !0);
					else if (1 == t) {
						let t;
						try {
							t = BigInt(Math.round(1e6 * performance.now()));
						} catch (s) {
							t = 0n;
						}
						r.setBigUint64(n, t, !0);
					} else r.setBigUint64(n, 0n, !0);
					return 0;
				},
				fd_advise: (t) => null != l.fds[t] ? 0 : 8,
				fd_allocate: (t, e, n) => null != l.fds[t] ? l.fds[t].fd_allocate(e, n) : 8,
				fd_close(t) {
					if (null != l.fds[t]) {
						const e = l.fds[t].fd_close();
						return l.fds[t] = void 0, e;
					}
					return 8;
				},
				fd_datasync: (t) => null != l.fds[t] ? l.fds[t].fd_sync() : 8,
				fd_fdstat_get(t, e) {
					if (null != l.fds[t]) {
						const { ret: n, fdstat: r } = l.fds[t].fd_fdstat_get();
						return null != r && r.write_bytes(new DataView(l.inst.exports.memory.buffer), e), n;
					}
					return 8;
				},
				fd_fdstat_set_flags: (t, e) => null != l.fds[t] ? l.fds[t].fd_fdstat_set_flags(e) : 8,
				fd_fdstat_set_rights: (t, e, n) => null != l.fds[t] ? l.fds[t].fd_fdstat_set_rights(e, n) : 8,
				fd_filestat_get(t, e) {
					if (null != l.fds[t]) {
						const { ret: n, filestat: r } = l.fds[t].fd_filestat_get();
						return null != r && r.write_bytes(new DataView(l.inst.exports.memory.buffer), e), n;
					}
					return 8;
				},
				fd_filestat_set_size: (t, e) => null != l.fds[t] ? l.fds[t].fd_filestat_set_size(e) : 8,
				fd_filestat_set_times: (t, e, n, r) => null != l.fds[t] ? l.fds[t].fd_filestat_set_times(e, n, r) : 8,
				fd_pread(e, n, r, s, i) {
					const o = new DataView(l.inst.exports.memory.buffer), a = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[e]) {
						const f = t.read_bytes_array(o, n, r);
						let d = 0;
						for (const t of f) {
							const { ret: n, data: r } = l.fds[e].fd_pread(t.buf_len, s);
							if (0 != n) return o.setUint32(i, d, !0), n;
							if (a.set(r, t.buf), d += r.length, s += BigInt(r.length), r.length != t.buf_len) break;
						}
						return o.setUint32(i, d, !0), 0;
					}
					return 8;
				},
				fd_prestat_get(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const { ret: r, prestat: s } = l.fds[t].fd_prestat_get();
						return null != s && s.write_bytes(n, e), r;
					}
					return 8;
				},
				fd_prestat_dir_name(t, e, n) {
					if (null != l.fds[t]) {
						const { ret: r, prestat: s } = l.fds[t].fd_prestat_get();
						if (null == s) return r;
						const i = s.inner.pr_name;
						return new Uint8Array(l.inst.exports.memory.buffer).set(i.slice(0, n), e), i.byteLength > n ? 37 : 0;
					}
					return 8;
				},
				fd_pwrite(t, n, r, s, i) {
					const o = new DataView(l.inst.exports.memory.buffer), a = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const f = e.read_bytes_array(o, n, r);
						let d = 0;
						for (const e of f) {
							const n = a.slice(e.buf, e.buf + e.buf_len), { ret: r, nwritten: f } = l.fds[t].fd_pwrite(n, s);
							if (0 != r) return o.setUint32(i, d, !0), r;
							if (d += f, s += BigInt(f), f != n.byteLength) break;
						}
						return o.setUint32(i, d, !0), 0;
					}
					return 8;
				},
				fd_read(e, n, r, s) {
					const i = new DataView(l.inst.exports.memory.buffer), o = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[e]) {
						const a = t.read_bytes_array(i, n, r);
						let f = 0;
						for (const t of a) {
							const { ret: n, data: r } = l.fds[e].fd_read(t.buf_len);
							if (0 != n) return i.setUint32(s, f, !0), n;
							if (o.set(r, t.buf), f += r.length, r.length != t.buf_len) break;
						}
						return i.setUint32(s, f, !0), 0;
					}
					return 8;
				},
				fd_readdir(t, e, n, r, s) {
					const i = new DataView(l.inst.exports.memory.buffer), o = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						let a = 0;
						for (;;) {
							const { ret: f, dirent: d } = l.fds[t].fd_readdir_single(r);
							if (0 != f) return i.setUint32(s, a, !0), f;
							if (null == d) break;
							if (n - a < d.head_length()) {
								a = n;
								break;
							}
							const u = new ArrayBuffer(d.head_length());
							if (d.write_head_bytes(new DataView(u), 0), o.set(new Uint8Array(u).slice(0, Math.min(u.byteLength, n - a)), e), e += d.head_length(), a += d.head_length(), n - a < d.name_length()) {
								a = n;
								break;
							}
							d.write_name_bytes(o, e, n - a), e += d.name_length(), a += d.name_length(), r = d.d_next;
						}
						return i.setUint32(s, a, !0), 0;
					}
					return 8;
				},
				fd_renumber(t, e) {
					if (null != l.fds[t] && null != l.fds[e]) {
						const n = l.fds[e].fd_close();
						return 0 != n ? n : (l.fds[e] = l.fds[t], l.fds[t] = void 0, 0);
					}
					return 8;
				},
				fd_seek(t, e, n, r) {
					const s = new DataView(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const { ret: i, offset: o } = l.fds[t].fd_seek(e, n);
						return s.setBigInt64(r, o, !0), i;
					}
					return 8;
				},
				fd_sync: (t) => null != l.fds[t] ? l.fds[t].fd_sync() : 8,
				fd_tell(t, e) {
					const n = new DataView(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const { ret: r, offset: s } = l.fds[t].fd_tell();
						return n.setBigUint64(e, s, !0), r;
					}
					return 8;
				},
				fd_write(t, n, r, s) {
					const i = new DataView(l.inst.exports.memory.buffer), o = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const a = e.read_bytes_array(i, n, r);
						let f = 0;
						for (const e of a) {
							const n = o.slice(e.buf, e.buf + e.buf_len), { ret: r, nwritten: a } = l.fds[t].fd_write(n);
							if (0 != r) return i.setUint32(s, f, !0), r;
							if (f += a, a != n.byteLength) break;
						}
						return i.setUint32(s, f, !0), 0;
					}
					return 8;
				},
				path_create_directory(t, e, n) {
					const r = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const s = new TextDecoder("utf-8").decode(r.slice(e, e + n));
						return l.fds[t].path_create_directory(s);
					}
					return 8;
				},
				path_filestat_get(t, e, n, r, s) {
					const i = new DataView(l.inst.exports.memory.buffer), o = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const a = new TextDecoder("utf-8").decode(o.slice(n, n + r)), { ret: f, filestat: d } = l.fds[t].path_filestat_get(e, a);
						return null != d && d.write_bytes(i, s), f;
					}
					return 8;
				},
				path_filestat_set_times(t, e, n, r, s, i, o) {
					const a = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const f = new TextDecoder("utf-8").decode(a.slice(n, n + r));
						return l.fds[t].path_filestat_set_times(e, f, s, i, o);
					}
					return 8;
				},
				path_link(t, e, n, r, s, i, o) {
					const a = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t] && null != l.fds[s]) {
						const f = new TextDecoder("utf-8").decode(a.slice(n, n + r)), d = new TextDecoder("utf-8").decode(a.slice(i, i + o)), { ret: u, inode_obj: c } = l.fds[t].path_lookup(f, e);
						return null == c ? u : l.fds[s].path_link(d, c, !1);
					}
					return 8;
				},
				path_open(t, e, n, r, s, i, o, a, d) {
					const u = new DataView(l.inst.exports.memory.buffer), c = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const _ = new TextDecoder("utf-8").decode(c.slice(n, n + r));
						f.log(_);
						const { ret: h, fd_obj: p } = l.fds[t].path_open(e, _, s, i, o, a);
						if (0 != h) return h;
						l.fds.push(p);
						const y = l.fds.length - 1;
						return u.setUint32(d, y, !0), 0;
					}
					return 8;
				},
				path_readlink(t, e, n, r, s, i) {
					const o = new DataView(l.inst.exports.memory.buffer), a = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const d = new TextDecoder("utf-8").decode(a.slice(e, e + n));
						f.log(d);
						const { ret: u, data: c } = l.fds[t].path_readlink(d);
						if (null != c) {
							const t = new TextEncoder().encode(c);
							if (t.length > s) return o.setUint32(i, 0, !0), 8;
							a.set(t, r), o.setUint32(i, t.length, !0);
						}
						return u;
					}
					return 8;
				},
				path_remove_directory(t, e, n) {
					const r = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const s = new TextDecoder("utf-8").decode(r.slice(e, e + n));
						return l.fds[t].path_remove_directory(s);
					}
					return 8;
				},
				path_rename(t, e, n, r, s, i) {
					const o = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t] && null != l.fds[r]) {
						const a = new TextDecoder("utf-8").decode(o.slice(e, e + n)), f = new TextDecoder("utf-8").decode(o.slice(s, s + i));
						let { ret: d, inode_obj: u } = l.fds[t].path_unlink(a);
						if (null == u) return d;
						if (d = l.fds[r].path_link(f, u, !0), 0 != d && 0 != l.fds[t].path_link(a, u, !0)) throw "path_link should always return success when relinking an inode back to the original place";
						return d;
					}
					return 8;
				},
				path_symlink(t, e, n, r, s) {
					const i = new Uint8Array(l.inst.exports.memory.buffer);
					return null != l.fds[n] ? (new TextDecoder("utf-8").decode(i.slice(t, t + e)), new TextDecoder("utf-8").decode(i.slice(r, r + s)), 58) : 8;
				},
				path_unlink_file(t, e, n) {
					const r = new Uint8Array(l.inst.exports.memory.buffer);
					if (null != l.fds[t]) {
						const s = new TextDecoder("utf-8").decode(r.slice(e, e + n));
						return l.fds[t].path_unlink_file(s);
					}
					return 8;
				},
				poll_oneoff(t, e, n) {
					if (0 === n) return 28;
					if (n > 1) return f.log("poll_oneoff: only a single subscription is supported"), 58;
					const r = new DataView(l.inst.exports.memory.buffer), s = i.read_bytes(r, t), a = s.eventtype, d = s.clockid, u = s.timeout;
					if (0 !== a) return f.log("poll_oneoff: only clock subscriptions are supported"), 58;
					let c;
					if (1 === d) c = () => BigInt(Math.round(1e6 * performance.now()));
					else {
						if (0 !== d) return 28;
						c = () => 1000000n * BigInt((/* @__PURE__ */ new Date()).getTime());
					}
					const _ = 1 & s.flags ? u : c() + u;
					for (; _ > c(););
					return new o(s.userdata, 0, a).write_bytes(r, e), 0;
				},
				proc_exit(t) {
					throw new d(t);
				},
				proc_raise(t) {
					throw "raised signal " + t;
				},
				sched_yield() {},
				random_get(t, e) {
					const n = new Uint8Array(l.inst.exports.memory.buffer).subarray(t, t + e);
					if (!("crypto" in globalThis) || "undefined" != typeof SharedArrayBuffer && l.inst.exports.memory.buffer instanceof SharedArrayBuffer) for (let r = 0; r < e; r++) n[r] = 256 * Math.random() | 0;
					else for (let r = 0; r < e; r += 65536) crypto.getRandomValues(n.subarray(r, r + 65536));
				},
				sock_recv(t, e, n) {
					throw "sockets not supported";
				},
				sock_send(t, e, n) {
					throw "sockets not supported";
				},
				sock_shutdown(t, e) {
					throw "sockets not supported";
				},
				sock_accept(t, e) {
					throw "sockets not supported";
				}
			};
		}
	};
	var c = class {
		fd_allocate(t, e) {
			return 58;
		}
		fd_close() {
			return 0;
		}
		fd_fdstat_get() {
			return {
				ret: 58,
				fdstat: null
			};
		}
		fd_fdstat_set_flags(t) {
			return 58;
		}
		fd_fdstat_set_rights(t, e) {
			return 58;
		}
		fd_filestat_get() {
			return {
				ret: 58,
				filestat: null
			};
		}
		fd_filestat_set_size(t) {
			return 58;
		}
		fd_filestat_set_times(t, e, n) {
			return 58;
		}
		fd_pread(t, e) {
			return {
				ret: 58,
				data: /* @__PURE__ */ new Uint8Array()
			};
		}
		fd_prestat_get() {
			return {
				ret: 58,
				prestat: null
			};
		}
		fd_pwrite(t, e) {
			return {
				ret: 58,
				nwritten: 0
			};
		}
		fd_read(t) {
			return {
				ret: 58,
				data: /* @__PURE__ */ new Uint8Array()
			};
		}
		fd_readdir_single(t) {
			return {
				ret: 58,
				dirent: null
			};
		}
		fd_seek(t, e) {
			return {
				ret: 58,
				offset: 0n
			};
		}
		fd_sync() {
			return 0;
		}
		fd_tell() {
			return {
				ret: 58,
				offset: 0n
			};
		}
		fd_write(t) {
			return {
				ret: 58,
				nwritten: 0
			};
		}
		path_create_directory(t) {
			return 58;
		}
		path_filestat_get(t, e) {
			return {
				ret: 58,
				filestat: null
			};
		}
		path_filestat_set_times(t, e, n, r, s) {
			return 58;
		}
		path_link(t, e, n) {
			return 58;
		}
		path_unlink(t) {
			return {
				ret: 58,
				inode_obj: null
			};
		}
		path_lookup(t, e) {
			return {
				ret: 58,
				inode_obj: null
			};
		}
		path_open(t, e, n, r, s, i) {
			return {
				ret: 54,
				fd_obj: null
			};
		}
		path_readlink(t) {
			return {
				ret: 58,
				data: null
			};
		}
		path_remove_directory(t) {
			return 58;
		}
		path_rename(t, e, n) {
			return 58;
		}
		path_unlink_file(t) {
			return 58;
		}
	}, _ = class t {
		static issue_ino() {
			return t.next_ino++;
		}
		static root_ino() {
			return 0n;
		}
		constructor() {
			this.ino = t.issue_ino();
		}
	};
	_.next_ino = 1n;
	var h = class extends c {
		fd_allocate(t, e) {
			if (this.file.size > t + e);
			else {
				const n = new Uint8Array(Number(t + e));
				n.set(this.file.data, 0), this.file.data = n;
			}
			return 0;
		}
		fd_fdstat_get() {
			return {
				ret: 0,
				fdstat: new r(4, 0)
			};
		}
		fd_filestat_set_size(t) {
			if (this.file.size > t) this.file.data = new Uint8Array(this.file.data.buffer.slice(0, Number(t)));
			else {
				const e = new Uint8Array(Number(t));
				e.set(this.file.data, 0), this.file.data = e;
			}
			return 0;
		}
		fd_read(t) {
			const e = this.file.data.slice(Number(this.file_pos), Number(this.file_pos + BigInt(t)));
			return this.file_pos += BigInt(e.length), {
				ret: 0,
				data: e
			};
		}
		fd_pread(t, e) {
			return {
				ret: 0,
				data: this.file.data.slice(Number(e), Number(e + BigInt(t)))
			};
		}
		fd_seek(t, e) {
			let n;
			switch (e) {
				case 0:
					n = t;
					break;
				case 1:
					n = this.file_pos + t;
					break;
				case 2:
					n = BigInt(this.file.data.byteLength) + t;
					break;
				default: return {
					ret: 28,
					offset: 0n
				};
			}
			return n < 0 ? {
				ret: 28,
				offset: 0n
			} : (this.file_pos = n, {
				ret: 0,
				offset: this.file_pos
			});
		}
		fd_tell() {
			return {
				ret: 0,
				offset: this.file_pos
			};
		}
		fd_write(t) {
			if (this.file.readonly) return {
				ret: 8,
				nwritten: 0
			};
			if (this.file_pos + BigInt(t.byteLength) > this.file.size) {
				const e = this.file.data;
				this.file.data = new Uint8Array(Number(this.file_pos + BigInt(t.byteLength))), this.file.data.set(e);
			}
			return this.file.data.set(t, Number(this.file_pos)), this.file_pos += BigInt(t.byteLength), {
				ret: 0,
				nwritten: t.byteLength
			};
		}
		fd_pwrite(t, e) {
			if (this.file.readonly) return {
				ret: 8,
				nwritten: 0
			};
			if (e + BigInt(t.byteLength) > this.file.size) {
				const n = this.file.data;
				this.file.data = new Uint8Array(Number(e + BigInt(t.byteLength))), this.file.data.set(n);
			}
			return this.file.data.set(t, Number(e)), {
				ret: 0,
				nwritten: t.byteLength
			};
		}
		fd_filestat_get() {
			return {
				ret: 0,
				filestat: this.file.stat()
			};
		}
		constructor(t) {
			super(), this.file_pos = 0n, this.file = t;
		}
	}, p = class extends c {
		fd_seek(t, e) {
			return {
				ret: 8,
				offset: 0n
			};
		}
		fd_tell() {
			return {
				ret: 8,
				offset: 0n
			};
		}
		fd_allocate(t, e) {
			return 8;
		}
		fd_fdstat_get() {
			return {
				ret: 0,
				fdstat: new r(3, 0)
			};
		}
		fd_readdir_single(t) {
			if (f.enabled && (f.log("readdir_single", t), f.log(t, this.dir.contents.keys())), 0n == t) return {
				ret: 0,
				dirent: new n(1n, this.dir.ino, ".", 3)
			};
			if (1n == t) return {
				ret: 0,
				dirent: new n(2n, this.dir.parent_ino(), "..", 3)
			};
			if (t >= BigInt(this.dir.contents.size) + 2n) return {
				ret: 0,
				dirent: null
			};
			const [e, r] = Array.from(this.dir.contents.entries())[Number(t - 2n)];
			return {
				ret: 0,
				dirent: new n(t + 1n, r.ino, e, r.stat().filetype)
			};
		}
		path_filestat_get(t, e) {
			const { ret: n, path: r } = g.from(e);
			if (null == r) return {
				ret: n,
				filestat: null
			};
			const { ret: s, entry: i } = this.dir.get_entry_for_path(r);
			return null == i ? {
				ret: s,
				filestat: null
			} : {
				ret: 0,
				filestat: i.stat()
			};
		}
		path_lookup(t, e) {
			const { ret: n, path: r } = g.from(t);
			if (null == r) return {
				ret: n,
				inode_obj: null
			};
			const { ret: s, entry: i } = this.dir.get_entry_for_path(r);
			return null == i ? {
				ret: s,
				inode_obj: null
			} : {
				ret: 0,
				inode_obj: i
			};
		}
		path_open(t, e, n, r, s, i) {
			const { ret: o, path: a } = g.from(e);
			if (null == a) return {
				ret: o,
				fd_obj: null
			};
			let { ret: l, entry: f } = this.dir.get_entry_for_path(a);
			if (null == f) {
				if (44 != l) return {
					ret: l,
					fd_obj: null
				};
				if (1 & ~n) return {
					ret: 44,
					fd_obj: null
				};
				{
					const { ret: t, entry: r } = this.dir.create_entry_for_path(e, !(2 & ~n));
					if (null == r) return {
						ret: t,
						fd_obj: null
					};
					f = r;
				}
			} else if (!(4 & ~n)) return {
				ret: 20,
				fd_obj: null
			};
			return 2 & ~n || 3 === f.stat().filetype ? f.path_open(n, r, i) : {
				ret: 54,
				fd_obj: null
			};
		}
		path_create_directory(t) {
			return this.path_open(0, t, 3, 0n, 0n, 0).ret;
		}
		path_link(t, e, n) {
			const { ret: r, path: s } = g.from(t);
			if (null == s) return r;
			if (s.is_dir) return 44;
			const { ret: i, parent_entry: o, filename: a, entry: l } = this.dir.get_parent_dir_and_entry_for_path(s, !0);
			if (null == o || null == a) return i;
			if (null != l) {
				const t = 3 == e.stat().filetype, r = 3 == l.stat().filetype;
				if (t && r) {
					if (!(n && l instanceof m)) return 20;
					if (0 != l.contents.size) return 55;
				} else {
					if (t && !r) return 54;
					if (!t && r) return 31;
					if (4 != e.stat().filetype || 4 != l.stat().filetype) return 20;
				}
			}
			return n || 3 != e.stat().filetype ? (o.contents.set(a, e), 0) : 63;
		}
		path_unlink(t) {
			const { ret: e, path: n } = g.from(t);
			if (null == n) return {
				ret: e,
				inode_obj: null
			};
			const { ret: r, parent_entry: s, filename: i, entry: o } = this.dir.get_parent_dir_and_entry_for_path(n, !0);
			return null == s || null == i ? {
				ret: r,
				inode_obj: null
			} : null == o ? {
				ret: 44,
				inode_obj: null
			} : (s.contents.delete(i), {
				ret: 0,
				inode_obj: o
			});
		}
		path_unlink_file(t) {
			const { ret: e, path: n } = g.from(t);
			if (null == n) return e;
			const { ret: r, parent_entry: s, filename: i, entry: o } = this.dir.get_parent_dir_and_entry_for_path(n, !1);
			return null == s || null == i || null == o ? r : 3 === o.stat().filetype ? 31 : (s.contents.delete(i), 0);
		}
		path_remove_directory(t) {
			const { ret: e, path: n } = g.from(t);
			if (null == n) return e;
			const { ret: r, parent_entry: s, filename: i, entry: o } = this.dir.get_parent_dir_and_entry_for_path(n, !1);
			return null == s || null == i || null == o ? r : o instanceof m && 3 === o.stat().filetype ? 0 !== o.contents.size ? 55 : s.contents.delete(i) ? 0 : 44 : 54;
		}
		fd_filestat_get() {
			return {
				ret: 0,
				filestat: this.dir.stat()
			};
		}
		fd_filestat_set_size(t) {
			return 8;
		}
		fd_read(t) {
			return {
				ret: 8,
				data: /* @__PURE__ */ new Uint8Array()
			};
		}
		fd_pread(t, e) {
			return {
				ret: 8,
				data: /* @__PURE__ */ new Uint8Array()
			};
		}
		fd_write(t) {
			return {
				ret: 8,
				nwritten: 0
			};
		}
		fd_pwrite(t, e) {
			return {
				ret: 8,
				nwritten: 0
			};
		}
		constructor(t) {
			super(), this.dir = t;
		}
	}, y = class extends p {
		fd_prestat_get() {
			return {
				ret: 0,
				prestat: l.dir(this.prestat_name)
			};
		}
		constructor(t, e) {
			super(new m(e)), this.prestat_name = t;
		}
	}, w = class extends _ {
		path_open(t, e, n) {
			if (this.readonly && (e & BigInt(64)) == BigInt(64)) return {
				ret: 63,
				fd_obj: null
			};
			if (!(8 & ~t)) {
				if (this.readonly) return {
					ret: 63,
					fd_obj: null
				};
				this.data = new Uint8Array([]);
			}
			const r = new h(this);
			return 1 & n && r.fd_seek(0n, 2), {
				ret: 0,
				fd_obj: r
			};
		}
		get size() {
			return BigInt(this.data.byteLength);
		}
		stat() {
			return new s(this.ino, 4, this.size);
		}
		constructor(t, e) {
			super(), this.data = new Uint8Array(t), this.readonly = !!e?.readonly;
		}
	};
	let g = class t {
		static from(e) {
			const n = new t();
			if (n.is_dir = e.endsWith("/"), e.startsWith("/")) return {
				ret: 76,
				path: null
			};
			if (e.includes("\0")) return {
				ret: 28,
				path: null
			};
			for (const t of e.split("/")) if ("" !== t && "." !== t) {
				if (".." !== t) n.parts.push(t);
				else if (null == n.parts.pop()) return {
					ret: 76,
					path: null
				};
			}
			return {
				ret: 0,
				path: n
			};
		}
		to_path_string() {
			let t = this.parts.join("/");
			return this.is_dir && (t += "/"), t;
		}
		constructor() {
			this.parts = [], this.is_dir = !1;
		}
	};
	var m = class t extends _ {
		parent_ino() {
			return null == this.parent ? _.root_ino() : this.parent.ino;
		}
		path_open(t, e, n) {
			return {
				ret: 0,
				fd_obj: new p(this)
			};
		}
		stat() {
			return new s(this.ino, 3, 0n);
		}
		get_entry_for_path(e) {
			let n = this;
			for (const r of e.parts) {
				if (!(n instanceof t)) return {
					ret: 54,
					entry: null
				};
				const e = n.contents.get(r);
				if (void 0 === e) return f.log(r), {
					ret: 44,
					entry: null
				};
				n = e;
			}
			return e.is_dir && 3 != n.stat().filetype ? {
				ret: 54,
				entry: null
			} : {
				ret: 0,
				entry: n
			};
		}
		get_parent_dir_and_entry_for_path(e, n) {
			const r = e.parts.pop();
			if (void 0 === r) return {
				ret: 28,
				parent_entry: null,
				filename: null,
				entry: null
			};
			const { ret: s, entry: i } = this.get_entry_for_path(e);
			if (null == i) return {
				ret: s,
				parent_entry: null,
				filename: null,
				entry: null
			};
			if (!(i instanceof t)) return {
				ret: 54,
				parent_entry: null,
				filename: null,
				entry: null
			};
			const o = i.contents.get(r);
			return void 0 === o ? n ? {
				ret: 0,
				parent_entry: i,
				filename: r,
				entry: null
			} : {
				ret: 44,
				parent_entry: null,
				filename: null,
				entry: null
			} : e.is_dir && 3 != o.stat().filetype ? {
				ret: 54,
				parent_entry: null,
				filename: null,
				entry: null
			} : {
				ret: 0,
				parent_entry: i,
				filename: r,
				entry: o
			};
		}
		create_entry_for_path(e, n) {
			const { ret: r, path: s } = g.from(e);
			if (null == s) return {
				ret: r,
				entry: null
			};
			let i, { ret: o, parent_entry: a, filename: l, entry: d } = this.get_parent_dir_and_entry_for_path(s, !0);
			return null == a || null == l ? {
				ret: o,
				entry: null
			} : null != d ? {
				ret: 20,
				entry: null
			} : (f.log("create", s), i = n ? new t(/* @__PURE__ */ new Map()) : new w(/* @__PURE__ */ new ArrayBuffer(0)), a.contents.set(l, i), d = i, {
				ret: 0,
				entry: d
			});
		}
		constructor(e) {
			super(), this.parent = null, this.contents = e instanceof Array ? new Map(e) : e;
			for (const n of this.contents.values()) n instanceof t && (n.parent = this);
		}
	}, b = class t extends c {
		fd_filestat_get() {
			return {
				ret: 0,
				filestat: new s(this.ino, 2, BigInt(0))
			};
		}
		fd_fdstat_get() {
			const t = new r(2, 0);
			return t.fs_rights_base = BigInt(64), {
				ret: 0,
				fdstat: t
			};
		}
		fd_write(t) {
			return this.write(t), {
				ret: 0,
				nwritten: t.byteLength
			};
		}
		static lineBuffered(e) {
			const n = new TextDecoder("utf-8", { fatal: !1 });
			let r = "";
			return new t((t) => {
				r += n.decode(t, { stream: !0 });
				const s = r.split("\n");
				for (const [n, i] of s.entries()) n < s.length - 1 ? e(i) : r = i;
			});
		}
		constructor(t) {
			super(), this.ino = _.issue_ino(), this.write = t;
		}
	};
	let x = null;
	self.onmessage = (t) => {
		(async function(t) {
			if ("init" !== t.type) if (x) try {
				if ("query" === t.type) {
					const e = x.query(t.options);
					self.postMessage({
						type: "result",
						id: t.id,
						ok: !0,
						data: e
					});
				} else if ("convert" === t.type) {
					const e = await x.convert(t.options, t.stdin, t.files);
					self.postMessage({
						type: "result",
						id: t.id,
						ok: !0,
						data: e
					});
				}
			} catch (e) {
				self.postMessage({
					type: "result",
					id: t.id,
					ok: !1,
					error: String(e)
				});
			}
			else self.postMessage({
				type: "result",
				id: t.id,
				ok: !1,
				error: "Pandoc engine is not initialised yet."
			});
			else try {
				x = await function(t) {
					const e = [
						"pandoc.wasm",
						"+RTS",
						"-H64m",
						"-RTS"
					], n = /* @__PURE__ */ new Map(), r = [
						new h(new w(/* @__PURE__ */ new Uint8Array(), { readonly: !0 })),
						b.lineBuffered((t) => console.log(`[WASI stdout] ${t}`)),
						b.lineBuffered((t) => console.warn(`[WASI stderr] ${t}`)),
						new y("/", n)
					], s = new u(e, [], r, { debug: !1 });
					return WebAssembly.instantiate(t, { wasi_snapshot_preview1: s.wasiImport }).then(({ instance: t }) => {
						function r() {
							return new DataView(t.exports.memory.buffer);
						}
						s.initialize(t), t.exports.__wasm_call_ctors();
						const i = t.exports.malloc(4);
						r().setUint32(i, e.length, !0);
						const o = t.exports.malloc(4 * (e.length + 1));
						for (let n = 0; n < e.length; ++n) {
							const s = t.exports.malloc(e[n].length + 1);
							new TextEncoder().encodeInto(e[n], new Uint8Array(t.exports.memory.buffer, s, e[n].length)), r().setUint8(s + e[n].length, 0), r().setUint32(o + 4 * n, s, !0);
						}
						r().setUint32(o + 4 * e.length, 0, !0);
						const a = t.exports.malloc(4);
						async function l(t, e, r) {
							let s;
							if ("string" == typeof e) s = new TextEncoder().encode(e);
							else {
								const t = await e.arrayBuffer();
								s = new Uint8Array(t);
							}
							const i = new w(s, { readonly: r });
							n.set(t, i);
						}
						async function f(e, r, s) {
							const i = JSON.stringify(e), o = new TextEncoder().encode(i), a = t.exports.malloc(o.length);
							new TextEncoder().encodeInto(i, new Uint8Array(t.exports.memory.buffer, a, o.length)), s = { ...s }, n.clear();
							const f = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !0 }), d = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !1 }), u = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !1 }), c = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !1 });
							n.set("stdin", f), n.set("stdout", d), n.set("stderr", u), n.set("warnings", c);
							const _ = /* @__PURE__ */ new Set([
								"stdin",
								"stdout",
								"stderr",
								"warnings"
							]);
							for (const t in s) await l(t, s[t], !0), _.add(t);
							const h = e["output-file"] || null, p = e["extract-media"] || null;
							if (h && (await l(h, new Blob(), !1), _.add(h)), p && (await l(p, new Blob(), !1), p.endsWith(".zip") && _.add(p)), r && (f.data = new TextEncoder().encode(r)), t.exports.convert(a, o.length), e["output-file"]) {
								const t = n.get(e["output-file"]);
								t && t.data && t.data.length > 0 && (s[e["output-file"]] = new Blob([t.data]));
							}
							if (e["extract-media"]) {
								const t = n.get(e["extract-media"]);
								t && t.data && t.data.length > 0 && (s[e["extract-media"]] = new Blob([t.data], { type: "application/zip" }));
							}
							const y = {};
							for (const [t, l] of n.entries()) if (!_.has(t) && l && l.data && l.data.length > 0) {
								const e = new Blob([l.data]);
								s[t] = e, t !== h && t !== p && (y[t] = e);
							}
							const g = new TextDecoder("utf-8", { fatal: !0 }).decode(c.data);
							let m = [];
							if (g) try {
								m = JSON.parse(g);
							} catch (b) {
								console.warn("Failed to parse warnings:", b);
							}
							return {
								stdout: new TextDecoder("utf-8", { fatal: !0 }).decode(d.data),
								stderr: new TextDecoder("utf-8", { fatal: !0 }).decode(u.data),
								warnings: m,
								files: s,
								mediaFiles: y
							};
						}
						async function d(t) {
							let e;
							if ("string" == typeof t) e = new TextEncoder().encode(t);
							else {
								if (!(t instanceof Blob)) throw new Error("Unsupported type: inData must be a string or a Blob");
								{
									const n = await t.arrayBuffer();
									e = new Uint8Array(n);
								}
							}
							return e;
						}
						r().setUint32(a, o, !0), t.exports.hs_init_with_rtsopts(i, a);
						const u = new TextDecoder("utf-8", { fatal: !0 });
						function c(t) {
							let e;
							try {
								e = u.decode(t);
							} catch (n) {
								e = new Blob([t]);
							}
							return e;
						}
						return {
							convert: f,
							query: function(e) {
								const r = JSON.stringify(e), s = new TextEncoder().encode(r), i = t.exports.malloc(s.length);
								new TextEncoder().encodeInto(r, new Uint8Array(t.exports.memory.buffer, i, s.length)), n.clear();
								const o = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !1 }), a = new w(/* @__PURE__ */ new Uint8Array(), { readonly: !1 });
								n.set("stdout", o), n.set("stderr", a), t.exports.query(i, s.length);
								const l = new TextDecoder("utf-8", { fatal: !0 }).decode(a.data);
								l && console.log(l);
								const f = new TextDecoder("utf-8", { fatal: !0 }).decode(o.data);
								return JSON.parse(f);
							},
							pandoc: async function(t, e, n = []) {
								const r = t.trim().split(/\s+/), s = {}, i = {};
								let o = 0;
								for (; o < r.length;) {
									const t = r[o];
									"-f" === t || "--from" === t ? s.from = r[++o] : "-t" === t || "--to" === t ? s.to = r[++o] : "-o" === t || "--output" === t ? s["output-file"] = r[++o] : "-s" === t || "--standalone" === t ? s.standalone = !0 : "--extract-media" === t ? s["extract-media"] = r[++o] : "--toc" !== t && "--table-of-contents" !== t || (s["table-of-contents"] = !0), o++;
								}
								for (const f of n) if ("string" == typeof f.contents) i[f.filename] = f.contents;
								else {
									const t = await d(f.contents);
									i[f.filename] = new Blob([t]);
								}
								let a = null;
								if (e) if ("string" == typeof e) a = e;
								else {
									const t = await d(e);
									a = new TextDecoder("utf-8").decode(t);
								}
								const l = await f(s, a, i), u = /* @__PURE__ */ new Map();
								for (const [f, d] of Object.entries(l.mediaFiles)) u.set(f, c(new Uint8Array(await d.arrayBuffer())));
								let _;
								return _ = s["output-file"] && l.files[s["output-file"]] ? c(new Uint8Array(await l.files[s["output-file"]].arrayBuffer())) : l.stdout, {
									out: _,
									mediaFiles: u
								};
							}
						};
					});
				}(t.wasm), self.postMessage({ type: "ready" });
			} catch (e) {
				self.postMessage({
					type: "init-error",
					error: String(e)
				});
			}
		})(t.data);
	};
})();
