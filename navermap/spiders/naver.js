/*!
 * geolocation-widget - v1.3.0 - 2016-03-21 14:26:07
 */
! function() {
    function Geolocation(t) {
        FlyJSONP.init(), this._setOptions(t), this._addEventListenerAtInit()
    }

    function bind(t, e) {
        var i, n, s = [];
        if (t.bind) {
            for (i = 1, n = arguments.length; n > i; ++i) s.push(arguments[i]);
            return t.bind.apply(t, s)
        }
        for (i = 2, n = arguments.length; n > i; ++i) s.push(arguments[i]);
        return function() {
            for (var i = [], n = 0, o = arguments.length; o > n; ++n) i[n] = arguments[n];
            return t.apply(e, s.concat(i))
        }
    }

    function getURL(t) {
        var e = {
                COMMON: {
                    SEARCH: "https://ssl.map.naver.com/search/placeAddressList.nhn",
                    COORD_TO_ADDR: "https://ssl.map.naver.com/address/searchCoordToAddr.nhn",
                    TERM_AGREEMENT: "https://nid.naver.com/iasystem/m_pop.nhn",
                    LCS: "https://lcs.naver.com/m"
                },
                HTTP: {
                    GUIDE_PAGE: "http://sstatic.map.naver.net/widget/location_setting_info.html",
                    CSS: "http://sstatic.map.naver.net/widget/css/my_lct.css"
                },
                SSL: {
                    GUIDE_PAGE: "https://ssl.pstatic.net/sstatic.map/widget/location_setting_info.html",
                    CSS: "https://ssl.pstatic.net/sstatic.map/widget/css/my_lct.s.css"
                },
                MLOC: {
                    GET_TOKEN: "https://mloc.map.naver.com/service/getToken.nhn",
                    SET_MLOC: "https://mloc.map.naver.com/service/location/setLocationInfoAjax.nhn",
                    GET_MLOC: "https://mloc.map.naver.com/service/location/getLocationInfoAjax.nhn"
                }
            },
            i = "";
        return i = e.MLOC[t] ? e.MLOC[t] : SSL && e.SSL[t] ? e.SSL[t] : e.HTTP[t] ? e.HTTP[t] : e.COMMON[t]
    }

    function refineReturnData(t, e) {
        var i;
        return t.coords ? i = {
            latitude: t.coords.latitude,
            longitude: t.coords.longitude
        } : t.ypos ? (i = {
            latitude: +t.ypos,
            longitude: +t.xpos,
            name: t.placeName
        }, t.region ? (i.code = t.region.rcode, i.location = getLocationName(t.region.siName, t.region.dongName), i["do"] = t.region.doName, i.si = t.region.siName, i.dong = t.region.dongName, i.dongType = t.region.regionType) : i.status = ERRORS.ADDRESS_NOT_EXIST) : i = {
            latitude: e.latitude,
            longitude: e.longitude,
            name: e.name,
            code: t.code,
            location: getLocationName(t.si, t.dong),
            "do": t["do"],
            si: t.si,
            dong: t.dong,
            dongType: t.hcode ? "A" : "L"
        }, i
    }

    function getLocationName(t, e) {
        var i, n = "";
        return t ? (i = t.slice(t.lastIndexOf(" ") + 1), n = i ? i + " " + e : e) : e && (n = e), n.replace(/(^\s*)|(\s*$)/gi, "")
    }

    function getDomData(t) {
        var e;
        return e = t.dataset ? {
            latitude: +t.dataset.latitude,
            longitude: +t.dataset.longitude,
            location: t.dataset.location || "",
            name: t.dataset.name || "",
            code: t.dataset.code || ""
        } : {
            latitude: +t.getAttribute("data-latitude"),
            longitude: +t.getAttribute("data-longitude"),
            location: t.getAttribute("data-location") || "",
            name: t.getAttribute("data-name") || "",
            code: t.getAttribute("data-code") || ""
        }
    }

    function _deleteCookie() {
        document.cookie = "m_loc= ; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=naver.com"
    }

    function _addEventHandler(t, e, i) {
        t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e, i)
    }

    function _removeEventHandler(t, e, i) {
        t.removeEventListener ? t.removeEventListener(e, i, !1) : t.detachEvent && t.detachEvent("on" + e, i)
    }

    function preventDefault(t) {
        "cancelable" in t ? t.preventDefault() : t.returnValue = !1
    }

    function stopPropagation(t) {
        "bubbles" in t ? t.stopPropagation() : t.cancelBubble = !0
    }

    function _remove(t) {
        t && (t.remove ? t.remove() : t.parentNode.removeChild(t))
    }

    function isIE8() {
        var t = document.createElement("div"),
            e = !1;
        return t.innerHTML = "<!--[if IE 8]>x<![endif]-->", document.body.appendChild(t), e = "x" === t.innerHTML, _remove(t), e
    }

    function getAgent() {
        for (var t = navigator.userAgent.toLowerCase(), e = ["ipad", "ipod", "iphone"], i = ["android"].concat(e), n = {
                mobile: null,
                version: null
            }, s = 0; s < i.length; ++s)
            if (t.indexOf(i[s]) > -1) {
                n.mobile = i[s];
                break
            } for (var o = 0; o < e.length; ++o)
            if (n.mobile === e[o]) {
                n.mobile = "iOS";
                break
            } var r;
        return r = "iOS" === n.mobile ? t.match(/version\/([\w.]+)/) : t.match(/android\s([0-9\.]*)/), r && r[1] && (n.version = parseFloat(r[1], 10)), n
    }

    function loadCss() {
        var t = document.createElement("link");
        t.setAttribute("rel", "stylesheet"), t.setAttribute("type", "text/css"), t.setAttribute("href", getURL("CSS")), document.getElementsByTagName("head")[0].appendChild(t)
    }

    function getNameSpace(t) {
        for (var e = t.split("."), i = window, n = 0, s = e.length; s > n; n++) i[e[n]] || (i[e[n]] = {}), i = i[e[n]];
        return i
    }
    var NS = getNameSpace("naver.map.api"),
        SSL = 0 === window.location.protocol.indexOf("https"),
        WIDGET_CALLER = "mobile_location_conf",
        DOCUMENT_ELEMENT = document.documentElement,
        ERRORS = {
            OUT_OF_BOUND: {
                code: "001",
                msg: "현재 위치는 서비스 제공 지역이 아닙니다."
            },
            FAIL_TO_SET_COOKIE: {
                code: "002",
                msg: "mloc 쿠키를 저장하지 못했습니다."
            },
            ADDRESS_NOT_EXIST: {
                code: "003",
                msg: "현재 위치는 주소 정보가 없는 지역입니다."
            },
            LOCATION_FAIL: {
                code: "010",
                msg: "일시적으로 내위치를 확인할 수 없습니다."
            },
            PERMISSION_DENIED: {
                code: "011",
                msg: "내 위치 확인을 위해 사용기기 및 브라우저의 설정에서 ‘위치정보’ 사용을 허용해 주시기 바랍니다."
            },
            BROWSER_SUPPORT: {
                code: "012",
                msg: "현재 사용 중인 환경에서는 지원하지 않는 기능입니다."
            },
            SERVER_NOT_RESPONDING: {
                code: "013",
                msg: "서버 응답이 없습니다."
            },
            FAIL_TO_GET_COOKIE: {
                code: "020",
                msg: "mloc 쿠키를 읽어올 수 없습니다."
            }
        },
        DEFAULT_ENV = {
            myLocationEl: null,
            changeLocationEl: null,
            currentLocationEl: null,
            success: emptyFn,
            myLocationSuccess: emptyFn,
            changeLocationSuccess: emptyFn,
            recentLocationSuccess: emptyFn,
            setCookie: !1,
            isGlobal: !1,
            recents: [],
            current: null,
            fail: emptyFn,
            remove: emptyFn,
            mode: "dev",
            serviceName: null,
            showGuideWith: "tab"
        },
        AGENT = getAgent(),
        runningId = null,
        isShown = !1,
        emptyFn = function() {},
        p = Geolocation.prototype,
        orientationEvent = "onorientationchange" in window ? "orientationchange" : "resize",
        touchstartEvent = "ontouchstart" in DOCUMENT_ELEMENT ? "touchstart" : "click";
    ! function() {
        var t = (window.location.host + "").split(":")[0],
            e = !1,
            i = [
                [102, 105, 108, 101],
                [108, 111, 99, 97, 108, 104, 111, 115, 116],
                [49, 50, 55, 46, 48, 46, 48, 46, 49],
                [110, 97, 118, 101, 114, 46, 99, 111, 109]
            ],
            n = function(i, n) {
                if (i) {
                    n = n || t;
                    for (var s = 0, o = i.length; o > s && !(e = new RegExp(String.fromCharCode.apply(String, i[s])).test(n)); s++);
                }
            };
        if (n(i), i) {
            if (!e) throw new Error("invalid access");
            loadCss()
        }
    }();
    var templateRepo = {
        permissionDenied: function(_d_) {
            var p = [];
            with(_d_) p.push('<div class="mylct_layer"><strong class="mylct_tit"><span class="mylct_spr mylct_ico_pin"></span>내위치</strong><p class="mylct_dsc">내 위치 확인을 위해 사용기기 및 브라우저의 설정에서 ‘위치정보’ 사용을 허용해 주시기 바랍니다.</p><a href="#" class="mylct_btn">확인</a><div class="mylct_tab"><a href="#" class="mylct_tab_a mylct_guide">위치 설정 안내<span class="mylct_spr mylct_ico_arr2"></span></a><a href="#" class="mylct_tab_a mylct_set_loc">직접 위치 설정<span class="mylct_spr mylct_ico_arr2"></span></a></div></div>');
            return p.join("")
        },
        alert: function(_d_) {
            var p = [];
            with(_d_) p.push('<div class="mylct_layer"><p class="mylct_dsc_center">', errMsg, '</p><a href="#" class="mylct_btn">확인</a></div>');
            return p.join("")
        },
        search: function(_d_) {
            var p = [];
            with(_d_) p.push('<div class="mylct_layer"><strong class="mylct_tit2">위치 변경</strong><a href="#" class="mylct_spr mylct_cls">위치 변경 레이어 닫기</a><div class="mylct_sch"><form method="post" onsubmit="return false;"><div class="mylct_sch_form"><div class="mylct_sch_input"><input type="search" class="mylct_sch_query" placeholder="주소, 장소명을 입력하세요"><button type="button" class="mylct_sch_del"><span class="mylct_spr mylct_ico_del">삭제</span></button></div><button type="submit" class="mylct_sch_btn"><span class="mylct_spr mylct_ico_sch">검색</span></button></div></form><div class="mylct_sch_results"></div></div>'), items.length && (p.push('<div class="mylct_rcts"><div class="mylct_tit3"><strong>최근위치</strong><a href="#" class="mylct_rm_mloc">삭제</a></div><ul class="mylct_lst">'), items.forEach(function(t) {
                t.name ? p.push('<li data-name="', t.name, '" data-location="', t.location, '" data-latitude="', t.latitude, '" data-longitude="', t.longitude, '" data-code="', t.code, '"><a href="#" class="mylct_lst_overflow"><span class="mylct_ells">', t.name, "</span><span>(", t.location, ")</span></a></li>") : p.push('<li data-location="', t.location, '" data-latitude="', t.latitude, '" data-longitude="', t.longitude, '" data-code="', t.code, '"><a href="#">', t.location, "</a></li>")
            }), p.push("</ul></div>")), p.push("</div>");
            return p.join("")
        },
        resultNull: function(_d_) {
            var p = [];
            with(_d_) p.push('<div><p class="mylct_sch_txt"><strong></strong>에 대한 검색결과가 없습니다.</p></div>');
            return p.join("")
        },
        resultPlace: function(_d_) {
            var p = [];
            with(_d_) p.push('<div class="mylct_scroll"><ul class="mylct_lst2">'), items.forEach(function(t) {
                p.push('<li class="mylct_sch_rst" data-name="', t.name, '" data-latitude="', t.latitude, '" data-longitude="', t.longitude, '" data-code="', t.code, '"><a href="#"><span>', t.name, "</span><em>", t.address, "</em></a></li>")
            }), p.push("</ul></div>");
            return p.join("")
        },
        resultAddr: function(_d_) {
            var p = [];
            with(_d_) p.push('<div class="mylct_scroll"><div>'), items.forEach(function(t) {
                p.push('<div class="mylct_addr mylct_sch_rst" data-latitude="', t.latitude, '" data-longitude="', t.longitude, '" data-code="', t.code, '"><p>', t.address, "</p>");
                var e = "mylct_ico_addr";
                "" !== t.matchAddress && ("true" === t.isNewAddress && (e = "mylct_ico_addr2"), p.push('<span class="mylct_spr ', e, '"></span><em>', t.matchAddress, "</em>")), p.push("</div>")
            }), p.push("</div></div>");
            return p.join("")
        }
    };
    p.handlers = {
        permissionDenied: [{
            className: "mylct_btn",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._closeWidget(), this._removeOnFocusWindowHandler(), this._nclick("LCL*o.ok", t)
            }
        }, {
            className: "mylct_guide",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), _addEventHandler(window, "focus", bind(this._onFocusWindow, this)), _addEventHandler(window, "pageshow", bind(this._onFocusWindow, this)), this._nclick("LCL*o.info", t), this._lcs_do("location_setting_info.html", !0), "link" === this._env.showGuideWith ? (window.location.href = getURL("GUIDE_PAGE"), this._closeWidget()) : window.open(getURL("GUIDE_PAGE"))
            }
        }, {
            className: "mylct_set_loc",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._removeOnFocusWindowHandler(), this.searchLocation(), this._nclick("LCL*o.dir", t)
            }
        }],
        alert: [{
            className: "mylct_btn",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._closeWidget()
            }
        }],
        additionalAlert: [{
            className: "mylct_btn",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._unregister("additionalAlert"), _remove(this.additionalAlertDiv), this.wrapDiv.style.zIndex = 9999, this.wrapDiv.getElementsByClassName("mylct_sch_query")[0].focus(), this.additionalAlertDiv = null
            }
        }],
        search: [{
            className: "mylct_cls",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._closeWidget(), this._nclick("LCL*c.close", t)
            }
        }, {
            className: "mylct_sch_del",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t);
                var e = this.wrapDiv.getElementsByClassName("mylct_sch_query")[0];
                e.value = "", e.focus(), this._nclick("LCL*c.kwdx", t)
            }
        }, {
            className: "mylct_sch_query",
            eventName: "keyup",
            handler: function(t) {
                13 === t.keyCode && this._search(t)
            }
        }, {
            className: "mylct_sch_btn",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), this._search(t)
            }
        }, {
            className: "mylct_sch_results",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t);
                for (var e = t.target, i = t.currentTarget.className; - 1 === e.className.indexOf("mylct_sch_rst") && e.className !== i;) e = e.parentNode;
                e.className !== i && (this._closeWidget(), this._defineAction(getDomData(e), this._env.changeLocationSuccess), this._nclick("LCL*c.list", t))
            }
        }],
        recents: [{
            className: "mylct_lst",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t);
                for (var e = t.target, i = t.currentTarget.className;
                    "li" !== e.tagName.toLowerCase() && e.className !== i;) e = e.parentNode;
                e.className !== i && (this._closeWidget(), this._defineAction(getDomData(e), this._env.recentLocationSuccess), this._nclick("LCL*c.recent", t))
            }
        }, {
            className: "mylct_rm_mloc",
            eventName: "click",
            handler: function(t) {
                preventDefault(t), stopPropagation(t), _deleteCookie(), this._env.recents = [], this._removeRecents(), this._nclick("LCL*c.rdel", t)
            }
        }]
    }, p._setOptions = function(t) {
        var e = ["myLocationSuccess", "changeLocationSuccess", "recentLocationSuccess"];
        this._hasGeolocation = "geolocation" in navigator;
        for (var i = 0; 3 > i; i++) t[e[i]] || (t[e[i]] = t.success);
        this._env = {};
        for (var n in DEFAULT_ENV)
            if (DEFAULT_ENV.hasOwnProperty(n)) {
                var s = t[n];
                this._env[n] = s === !1 || s ? s : DEFAULT_ENV[n]
            } var o = this._env.recents[0] && getLocationName(this._env.recents[0].si, this._env.recents[0].dong);
        this._markCurrentLocation(o)
    }, p.getLocationInfo = function(t) {
        var e = this,
            i = function(i) {
                e._requestGetLocationInfo(i, t)
            },
            n = function(e) {
                t({
                    error: ERRORS.FAIL_TO_GET_COOKIE
                })
            };
        this._getToken(i, n)
    }, p.getCurrentLocation = function(t) {
        return t && (preventDefault(t), stopPropagation(t)), isIE8() ? void alert("현재 사용 중인 환경에서는 지원하지 않는 기능입니다.") : void(this._hasGeolocation ? navigator.geolocation.getCurrentPosition(bind(this._onSuccessGetPosition, this), bind(this._onFailGetPosition, this), {
            enableHighAccuracy: !0,
            timeout: 12e3,
            maximumAge: 18e4
        }) : this._onBrowserError())
    }, p.searchLocation = function(t) {
        if (t && (preventDefault(t), stopPropagation(t)), isIE8()) return void alert("현재 사용 중인 환경에서는 지원하지 않는 기능입니다.");
        for (var e = [], i = 0, n = this._env.recents.length; n > i; i++) {
            var s = this._env.recents[i];
            s.location ? e.push(s) : s.si && s.dong && e.push({
                latitude: s.latitude,
                longitude: s.longitude,
                name: s.name,
                code: s.code,
                location: getLocationName(s.si, s.dong)
            })
        }
        this._runWidget("search", {
            items: e
        }), e.length && (this._setMaxWidthToRecents(), this._register("recents", !0)), this._lcs_do("location_change")
    }, p._onSuccessGetPosition = function(t) {
        var e = refineReturnData(t);
        this._defineAction(e, this._env.myLocationSuccess)
    }, p._onFailGetPosition = function(t) {
        1 === t.code ? this._onPermissionError() : this._onUnavailablePositionError()
    }, p._defineAction = function(t, e) {
        var i = this._isValidLocation(t.longitude, t.latitude),
            n = bind(function(t, e) {
                t(e), this._markCurrentLocation(e.location)
            }, this, e);
        this._env.setCookie ? this._env.isGlobal || i ? this._setCookie(t, e) : this._onNotSupportedAreaError(t) : i ? this._requestCoordToAddr(t, n) : this._env.isGlobal ? n(t) : this._onNotSupportedAreaError(t)
    }, p._requestCoordToAddr = function(t, e) {
        FlyJSONP.get({
            url: getURL("COORD_TO_ADDR"),
            callbackParameter: "_callback",
            parameters: {
                coord: t.longitude + "," + t.latitude,
                caller: WIDGET_CALLER,
                output: "json"
            },
            success: function(i) {
                i.message.result ? t = refineReturnData(i.message.result.items[0], t) : 4 === i.message.error.code ? t.status = ERRORS.OUT_OF_BOUND : 2 === i.message.error.code ? t.status = ERRORS.ADDRESS_NOT_EXIST : t.status = ERRORS.SERVER_NOT_RESPONDING, e(t)
            },
            error: function(i) {
                t.status = ERRORS.SERVER_NOT_RESPONDING, e(t)
            }
        })
    }, p._search = function(t) {
        var e = this.wrapDiv.getElementsByClassName("mylct_sch_query")[0],
            i = e.value.trim();
        i.length > 120 ? this._runAdditionalAlert("isOverflow") : i ? this._requestSearch(i) : this._runAdditionalAlert(), e.blur(), this._nclick("LCL*c.search", t)
    }, p._setCookie = function(t, e) {
        var i = this,
            n = function(n) {
                i._requestSetLocationInfo(t, n, e)
            },
            s = function(i) {
                t.status = ERRORS.FAIL_TO_SET_COOKIE, e(t)
            };
        this._getToken(n, s)
    }, p._getToken = function(t, e) {
        FlyJSONP.get({
            url: getURL("GET_TOKEN"),
            callbackParameter: "_callback",
            parameters: {
                caller: WIDGET_CALLER,
                output: "json"
            },
            success: function(e) {
                var i = {
                    token: e.result.token,
                    randomKey: e.result.randomKey,
                    expireTime: e.result.expireTime
                };
                t(i)
            },
            error: e
        })
    }, p._requestGetLocationInfo = function(t, e) {
        var i = this;
        FlyJSONP.get({
            url: getURL("GET_MLOC"),
            callbackParameter: "_callback",
            parameters: {
                caller: WIDGET_CALLER,
                output: "json",
                token: t.token,
                isGlobal: !!i._env.isGlobal,
                randomKey: t.randomKey,
                expireTime: t.expireTime
            },
            success: function(t) {
                if (!t || !t.result) return void e({
                    error: ERRORS.FAIL_TO_GET_COOKIE
                });
                for (var i = [], n = 0, s = t.result.locationList.length; s > n; ++n) i.push(refineReturnData(t.result.locationList[n]));
                e(i)
            },
            error: function(t) {
                e({
                    error: ERRORS.FAIL_TO_GET_COOKIE
                })
            }
        })
    }, p._requestSetLocationInfo = function(t, e, i) {
        var n = this;
        FlyJSONP.get({
            url: getURL("SET_MLOC"),
            callbackParameter: "_callback",
            parameters: {
                caller: WIDGET_CALLER,
                output: "json",
                token: e.token,
                isGlobal: !!n._env.isGlobal,
                randomKey: e.randomKey,
                expireTime: e.expireTime,
                lng: t.longitude,
                lat: t.latitude,
                placeName: t.name || ""
            },
            success: function(e) {
                return e && e.result ? void n._onSuccessSetLocationInfo(e, t, i) : (t.status = ERRORS.FAIL_TO_SET_COOKIE, void i(t))
            },
            error: function() {
                t.status = ERRORS.FAIL_TO_SET_COOKIE, i(t)
            }
        })
    }, p._onSuccessSetLocationInfo = function(t, e, i) {
        if ("MOVE_AGREEMENT" === t.result.actionResult && t.result.agreementKey) {
            var n = getURL("TERM_AGREEMENT") + "?todo=setTermAgree_popup&token=" + t.result.agreementKey + "&return_url=" + encodeURIComponent(window.location.href);
            window.location.href = n
        } else if ("SUCCESS" === t.result.actionResult && t.result.locationList) {
            var s = refineReturnData(t.result.locationList[0]);
            i(s), this._updateRecents(t.result.locationList), this._markCurrentLocation(s.location)
        }
    }, p._requestSearch = function(t) {
        var e, i, n = this;
        if (this._env.current || this._env.recents[0]) {
            var s = this._env.current ? this._env.current : this._env.recents[0];
            e = +s.longitude, i = +s.latitude
        }
        FlyJSONP.get({
            url: getURL("SEARCH"),
            callbackParameter: "_callback",
            parameters: {
                caller: WIDGET_CALLER,
                includeNewAddress: !0,
                query: t,
                output: "json",
                pageNo: 1,
                pageSize: 50,
                xPos: e,
                yPos: i,
                sort: 0
            },
            success: function(e) {
                n._onSuccessSearch(e, t)
            },
            error: function() {
                this._onTemporaryError()
            }
        })
    }, p._onSuccessSearch = function(t, e) {
        t.message.result ? "place" === t.message.result.queryType ? this._updateSearchResult("resultPlace", {
            items: t.message.result.place.items
        }) : this._updateSearchResult("resultAddr", {
            items: t.message.result.address.items
        }) : 2 === t.message.error.code ? this._updateSearchResult("resultNull", {
            query: e
        }) : this._onTemporaryError(), this._updateWidgetPosition()
    }, p._runWidget = function(t, e) {
        isShown || (this._initWidget(), this._addEventHandlerToWindow(), this._addEventHandlerToDoc()), this._unregister(), this.wrapDiv.innerHTML = templateRepo[t](e ? e : {}), this._register(t), this._showWidget()
    }, p._closeWidget = function() {
        var t = this;
        this._unregister(), this._destroyIScroll(), setTimeout(function() {
            _remove(t.wrapDiv), _remove(t.dimDiv), t._removeEventHandlerFromWindow(), t._removeEventHandlerFromDoc(), clearTimeout(t.__lcsTimer), clearTimeout(t.__showTimer), clearInterval(t.__positionInterval), clearTimeout(t.__orientationTimer), t.wrapDiv = null, t.dimDiv = null, t.__positionInterval = null, t.__showTimer = null, t.__orientationTimer = null, t.__orientationHistory = null, t.__lastDirection = null, isShown = !1, t._env.remove && t._env.remove()
        }, 500)
    }, p._register = function(t, e) {
        var i = this.handlers[t];
        if (i) {
            for (var n = 0, s = i.length; s > n; n++) {
                var o = i[n],
                    r = this.additionalAlertDiv ? this.additionalAlertDiv.getElementsByClassName(o.className)[0] : this.wrapDiv.getElementsByClassName(o.className)[0];
                o.boundHandler = bind(o.handler, this), r && _addEventHandler(r, o.eventName, o.boundHandler)
            }
            e || (runningId = t)
        }
    }, p._unregister = function(t) {
        var e = t ? t : runningId;
        if (e === runningId && (runningId = null), e)
            for (var i = this.handlers[e], n = 0, s = i.length; s > n; n++) {
                var o = i[n],
                    r = this.additionalAlertDiv ? this.additionalAlertDiv.getElementsByClassName(o.className)[0] : this.wrapDiv.getElementsByClassName(o.className)[0];
                r && _removeEventHandler(r, o.eventName, o.boundHandler)
            }
    }, p._initWidget = function() {
        this.wrapDiv = document.createElement("div"), this.dimDiv = document.createElement("div"), this.wrapDiv.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;", this.dimDiv.className = "mylct_dmm", document.body.appendChild(this.dimDiv), document.body.appendChild(this.wrapDiv)
    }, p._showWidget = function() {
        var t = this;
        this._updateWidgetPosition(), clearTimeout(this.__showTimer), this.__showTimer = setTimeout(function() {
            t._updateWidgetPosition()
        }, 200), this.wrapDiv.style.zIndex = 9999, this.wrapDiv.style.visibility = "visible", isShown = !0
    }, p._onOrientationchange = function() {
        var t = 300,
            e = this;
        "android" === AGENT.mobile && AGENT.version < 4.1 && (t = 2e3), clearInterval(e.__positionInterval), clearTimeout(e.__orientationTimer), this.__positionInterval = setInterval(bind(this._updateWidgetPosition, this), 200), this.__orientationTimer = setTimeout(function() {
            clearInterval(e.__positionInterval), e.__positionInterval = null
        }, t)
    }, p._onScroll = function(t) {
        "hv" === this.__orientationHistory && this._updateWidgetPosition()
    }, p._updateWidgetPosition = function() {
        var t = this._getAbsoluteWidgetPoint();
        if (this.wrapDiv.style.left = t.left, this.wrapDiv.style.top = t.top, this.dimDiv.style.height = Math.max(DOCUMENT_ELEMENT.scrollHeight, DOCUMENT_ELEMENT.clientHeight) + "px", this.additionalAlertDiv) {
            var e = 50;
            this.additionalAlertDiv.style.left = t.left, this.additionalAlertDiv.style.top = parseInt(t.top, 10) + e + "px"
        }
        var i = this.wrapDiv.getElementsByClassName("mylct_scroll")[0];
        i && (this.wrapDiv.offsetHeight > DOCUMENT_ELEMENT.clientHeight ? i.style.maxHeight = 250 - (this.wrapDiv.offsetHeight - DOCUMENT_ELEMENT.clientHeight) + "px" : i.style.maxHeight = "250px")
    }, p._getAbsoluteWidgetPoint = function() {
        var t = DOCUMENT_ELEMENT.clientHeight,
            e = DOCUMENT_ELEMENT.clientWidth,
            i = void 0 !== window.pageYOffset ? window.pageYOffset : document.body.scrollTop,
            n = this.wrapDiv.offsetWidth || 294,
            s = this.wrapDiv.offsetHeight;
        return t > e ? currentDirection = "v" : (currentDirection = "h", t / 2 > s && "input" === document.activeElement.tagName.toLowerCase() && (t /= 2)), this.__orientationHistory = this.__lastDirection + currentDirection, this.__lastDirection = currentDirection, {
            left: (e - n) / 2 + "px",
            top: i + (t - s) / 2 + "px"
        }
    }, p._setMaxWidthToRecents = function() {
        for (var t = this.wrapDiv.getElementsByClassName("mylct_lst_overflow"), e = 0, i = t.length; i > e; e++) {
            var n = t[e].children;
            n[0].style.maxWidth = 250 - n[1].offsetWidth + "px"
        }
    }, p._addEventHandlerToWindow = function() {
        this._onOrientationchangeFunc = bind(this._onOrientationchange, this), _addEventHandler(window, orientationEvent, this._onOrientationchangeFunc), "iOS" === AGENT.mobile && (this._onScrollFunc = bind(this._onScroll, this), _addEventHandler(window, "scroll", this._onScrollFunc))
    }, p._removeEventHandlerFromWindow = function() {
        _removeEventHandler(window, orientationEvent, this._onOrientationchangeFunc), "iOS" === AGENT.mobile && _removeEventHandler(window, "scroll", this._onScrollFunc)
    }, p._addEventHandlerToDoc = function() {
        this._onClickDocFunc = bind(this._onClickDoc, this), _addEventHandler(document, touchstartEvent, this._onClickDocFunc)
    }, p._removeEventHandlerFromDoc = function() {
        _removeEventHandler(document, touchstartEvent, this._onClickDocFunc)
    }, p._removeRecents = function() {
        var t = this.wrapDiv.getElementsByClassName("mylct_rcts")[0];
        t && (this._unregister("recents"), _remove(t))
    }, p._updateSearchResult = function(t, e) {
        var i = this.wrapDiv.getElementsByClassName("mylct_sch_results")[0];
        this._removeRecents(), e.items ? i.innerHTML = templateRepo[t](e ? e : {}) : (i.innerHTML = templateRepo[t]({}), i.getElementsByTagName("strong")[0].textContent = "'" + e.query + "'"), this.scroll ? this.scroll.refresh() : this._runIScroll(i.children[0])
    }, p._updateRecents = function(t) {
        for (var e = [], i = 0, n = t.length; n > i; ++i) e.push(refineReturnData(t[i]));
        this._env.recents = e
    }, p._runAdditionalAlert = function(t) {
        var e = 50,
            i = "alert";
        this.additionalAlertDiv = document.createElement("div"), this.additionalAlertDiv.style.cssText = "position:absolute;z-index:9999;left:0;top:0;visibility:hidden", t ? this.additionalAlertDiv.innerHTML = templateRepo[i]({
            errMsg: "입력된 검색어가 길이를 초과하였습니다."
        }) : this.additionalAlertDiv.innerHTML = templateRepo[i]({
            errMsg: "검색어를 입력해 주세요."
        }), this.additionalAlertDiv.style.left = this.wrapDiv.style.left, this.additionalAlertDiv.style.top = parseInt(this.wrapDiv.style.top, 10) + e + "px", this._register("additionalAlert", !0), this.wrapDiv.style.zIndex = 9997, document.body.appendChild(this.additionalAlertDiv), this.additionalAlertDiv.style.visibility = "visible"
    }, p._addEventListenerAtInit = function() {
        this._env.myLocationEl && _addEventHandler(this._env.myLocationEl, "click", bind(this.getCurrentLocation, this)), this._env.changeLocationEl && _addEventHandler(this._env.changeLocationEl, "click", bind(this.searchLocation, this))
    }, p._markCurrentLocation = function(t) {
        this._env.currentLocationEl && (this._env.currentLocationEl.textContent = t || "위치 정보 없음")
    }, p._onBrowserError = function() {
        var t = {
            error: ERRORS.BROWSER_SUPPORT
        };
        this._runWidget("alert", {
            errMsg: "현재 사용 중인 환경에서는 지원하지 <br> 않는 기능입니다."
        }), this._env.fail && this._env.fail(t)
    }, p._onPermissionError = function() {
        var t = {
            error: ERRORS.PERMISSION_DENIED
        };
        this._runWidget("permissionDenied"), this._lcs_do("location_off"), this._env.fail && this._env.fail(t)
    }, p._onUnavailablePositionError = function() {
        var t = {
            error: ERRORS.LOCATION_FAIL
        };
        this._runWidget("alert", {
            errMsg: "일시적으로 내위치를 확인할 수 없습니다.<br>사용기기의 ‘위치정보’ 사용 설정을 확인해 주시기 바랍니다."
        }), this._env.fail && this._env.fail(t)
    }, p._onNotSupportedAreaError = function(t) {
        t.error = ERRORS.OUT_OF_BOUND, this._runWidget("alert", {
            errMsg: "현재 위치는 서비스 제공 지역이 아닙니다."
        }), this._env.fail && this._env.fail(t)
    }, p._onTemporaryError = function() {
        var t = {
            error: ERRORS.SERVER_NOT_RESPONDING
        };
        this._runWidget("alert", {
            errMsg: "잠시 후에 다시 이용해 주세요."
        }), this._env.fail && this._env.fail(t)
    }, p._runIScroll = function(t) {
        this.sroll = new IScroll(t, {
            click: !0
        })
    }, p._destroyIScroll = function() {
        this.scroll && this.sroll.destroy(), this.scroll = null
    }, p._onFocusWindow = function() {
        this.wrapDiv && this._onOrientationchange()
    }, p._removeOnFocusWindowHandler = function() {
        _removeEventHandler(window, "focus", p._onFocusWindow), _removeEventHandler(window, "pageshow", p._onFocusWindow)
    }, p._isValidLocation = function(t, e) {
        for (var i = [
                [132.0522019874555, 42.31869108211736],
                [138.68904030151623, 41.895789083500794],
                [138.36949279421253, 39.43212577548319],
                [132.54039378019982, 35.9968168034869],
                [131.8662265046598, 35.576268898678194],
                [130.2030167431902, 35.599676617543935],
                [128.99422125314925, 34.53281093165477],
                [128.45643642629798, 33.91972019645691],
                [127.92554285960122, 33.383687549821424],
                [127.0959679308713, 33.01547285981109],
                [127.06903311475105, 32.02793600115288],
                [125.46434953919055, 32.008568478349815],
                [123.22677535611585, 31.936150296736226],
                [122.90113744417913, 38.02176146559528],
                [124.37379016793402, 38.02795641629565],
                [124.72766726787152, 38.004185436112216],
                [124.79981026003695, 37.95962537590283],
                [124.86461771431544, 37.87154197936918],
                [124.96416160391156, 37.694286771982256],
                [125.09796512392805, 37.6186069346797],
                [125.21773294476507, 37.61456526211172],
                [125.54153519824457, 37.68631156297727],
                [125.7355176548997, 37.71029305215125],
                [126.09702702099419, 37.70789597640264],
                [126.14791889191763, 37.725060975268455],
                [126.20944213277129, 37.82413490505783],
                [126.43317100548711, 37.83520785322124],
                [126.59412928838054, 37.772500310496625],
                [126.6570420715132, 37.79355340341252],
                [126.65736871361622, 37.84535425846483],
                [126.65741182579174, 37.953007611073645],
                [126.70533766080608, 37.97804054750204],
                [126.81974433158321, 38.018999918892135],
                [126.85470832610409, 38.105224845614856],
                [126.96663019020065, 38.23439299418944],
                [127.1332386948304, 38.336975821384875],
                [127.23587802967275, 38.34573037492545],
                [127.3788176526406, 38.34596520308009],
                [127.57223961559684, 38.33858518185248],
                [127.61651764285548, 38.33765531681795],
                [127.7736270953916, 38.359604812479404],
                [128.00285190564912, 38.318873655583566],
                [128.04538858017258, 38.35430930698669],
                [128.2341972093181, 38.409992040212224],
                [128.30361758825953, 38.521131809080416],
                [128.30015671076006, 38.59912786121972],
                [128.3508028983317, 38.62309197692532],
                [132.0522019874555, 42.31869108211736]
            ], n = !1, s = i.length - 1, o = 0, r = 1, a = function(t, e, i) {
                return t[1] < i && e[1] >= i || e[1] < i && t[1] >= i
            }, c = function(t, e, i) {
                return t[0] <= i || e[0] <= i
            }, l = function(t, e, i, n) {
                return t[0] + (n - t[1]) / (e[1] - t[1]) * (e[0] - t[0]) < i
            }; s > o; o++) {
            var h = i[o],
                d = i[r];
            a(h, d, e) && c(h, d, t) && l(h, d, t, e) && (n = !n), r = o
        }
        return n
    }, p._onClickDoc = function(t) {
        for (var e = t.target; e !== document.body && -1 === e.className.indexOf("mylct_layer");) e = e.parentNode;
        e !== document.body && -1 !== e.className.indexOf("mylct_layer") || (preventDefault(t), stopPropagation(t), this._closeWidget(), this._nclick("LCL*c.close", t))
    }, p._nclick = function(t, e) {
        "real" === this._env.mode && (window.clickcr ? window.clickcr(e.currentTarget, t, "", "", e) : window.nclk && window.nclk(e.currentTarget, t, "", ""))
    }, p._lcs_do = function(t, e) {
        if ("real" === this._env.mode) {
            var i = this;
            this.__lcsTimer = setTimeout(function() {
                var n = ["http://openapi.map.naver.com/widget/", t, !e && i._env.serviceName ? "?svc=" + i._env.serviceName : ""].join(""),
                    s = document.referrer ? document.referrer : "",
                    o = [getURL("LCS"), "?u=", encodeURIComponent(n), "&e=", encodeURIComponent(s), "&EOU"].join("");
                if (document.images) {
                    var r = new Image;
                    r.src = o
                } else document.write('<img src="' + o + '" width="1" height="1" border="0" />')
            }, 0)
        }
    }, NS.Geolocation = Geolocation
}();
/*!
 * FlyJSONP v0.2
 * http://alotaiba.github.com/FlyJSONP
 *
 * FlyJSONP is a small JavaScript library, that allows you to do
 * cross-domain GET and POST requests with remote services that support
 * JSONP, and get a JSON response.
 *
 * Copyright (c) 2011 Abdulrahman Al-Otaiba
 * Dual-licensed under MIT and GPLv3.
 */
var FlyJSONP = function(t) {
    "use strict";
    var e, i, n, s, o, r, a, c, l;
    return i = function(t, e, i) {
        t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent ? t.attachEvent("on" + e, i) : t["on" + e] = i
    }, n = function(i, n) {
        e.log("Garbage collecting!"), n.parentNode.removeChild(n), t[i] = void 0;
        try {
            delete t[i]
        } catch (s) {}
    }, s = function(t, e) {
        var i, n, s = "";
        for (i in t) t.hasOwnProperty(i) && (i = e ? encodeURIComponent(i) : i, n = e ? encodeURIComponent(t[i]) : t[i], s += i + "=" + n + "&");
        return s.replace(/&$/, "")
    }, o = function() {
        var t = "",
            e = [],
            i = "0123456789ABCDEF",
            n = 0;
        for (n = 0; 32 > n; n += 1) e[n] = i.substr(Math.floor(16 * Math.random()), 1);
        return e[12] = "4", e[16] = i.substr(3 & e[16] | 8, 1), t = "flyjsonp_" + e.join("")
    }, r = function(t, i) {
        e.log(i), "undefined" != typeof t && t(i)
    }, a = function(t, i) {
        e.log("GET success"), "undefined" != typeof t && t(i), e.log(i)
    }, c = function(t, i) {
        e.log("POST success"), "undefined" != typeof t && t(i), e.log(i)
    }, l = function(t) {
        e.log("Request complete"), "undefined" != typeof t && t()
    }, e = {}, e.options = {
        debug: !1
    }, e.init = function(t) {
        var i;
        e.log("Initializing!");
        for (i in t) t.hasOwnProperty(i) && (e.options[i] = t[i]);
        return e.log("Initialization options"), e.log(e.options), !0
    }, e.log = function(i) {
        t.console && e.options.debug && t.console.log(i)
    }, e.get = function(h) {
        h = h || {};
        var d = h.url,
            u = h.callbackParameter || "callback",
            p = h.parameters || {},
            m = t.document.createElement("script"),
            _ = o(),
            v = "?";
        if (!d) throw new Error("URL must be specified!");
        p[u] = _, d.indexOf("?") >= 0 && (v = "&"), d += v + s(p, !0), t[_] = function(t) {
            "undefined" == typeof t ? r(h.error, "Invalid JSON data returned") : "post" === h.httpMethod ? (t = t.query.results, t && t.postresult ? (t = t.postresult.json ? t.postresult.json : t.postresult, c(h.success, t)) : r(h.error, "Invalid JSON data returned")) : a(h.success, t), n(_, m), l(h.complete)
        }, e.log("Getting JSONP data"), m.setAttribute("src", d), t.document.getElementsByTagName("head")[0].appendChild(m), i(m, "error", function() {
            n(_, m), l(h.complete), r(h.error, "Error while trying to access the URL")
        })
    }, e.post = function(t) {
        t = t || {};
        var i, n, o = t.url,
            r = t.parameters || {},
            a = {};
        if (!o) throw new Error("URL must be specified!");
        i = encodeURIComponent('select * from jsonpost where url="' + o + '" and postdata="' + s(r, !1) + '"'), n = "http://query.yahooapis.com/v1/public/yql?q=" + i + "&format=json&env=" + encodeURIComponent("store://datatables.org/alltableswithkeys"), a.url = n, a.httpMethod = "post", "undefined" != typeof t.success && (a.success = t.success), "undefined" != typeof t.error && (a.error = t.error), "undefined" != typeof t.complete && (a.complete = t.complete), e.get(a)
    }, e
}(this);
/*!
 * iScroll
 * https://github.com/cubiq/iscroll
 *
 * Copyright (c) 2014 Matteo Spinelli, cubiq.org
 * Licensed under MIT
 */
! function(t, e, i) {
    function n(t, i) {
        this.wrapper = "string" == typeof t ? e.querySelector(t) : t, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = {
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0
        };
        for (var n in i) this.options[n] = i[n];
        this.translateZ = this.options.HWCompositing && o.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = o.hasTransition && this.options.useTransition, this.options.useTransform = o.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? o.ease[this.options.bounceEasing] || o.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable()
    }
    var s = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function(e) {
            t.setTimeout(e, 1e3 / 60)
        },
        o = function() {
            function n(t) {
                return r === !1 ? !1 : "" === r ? t : r + t.charAt(0).toUpperCase() + t.substr(1)
            }
            var s = {},
                o = e.createElement("div").style,
                r = function() {
                    for (var t, e = ["t", "webkitT", "MozT", "msT", "OT"], i = 0, n = e.length; n > i; i++)
                        if (t = e[i] + "ransform", t in o) return e[i].substr(0, e[i].length - 1);
                    return !1
                }();
            s.getTime = Date.now || function() {
                return (new Date).getTime()
            }, s.extend = function(t, e) {
                for (var i in e) t[i] = e[i]
            }, s.addEvent = function(t, e, i, n) {
                t.addEventListener(e, i, !!n)
            }, s.removeEvent = function(t, e, i, n) {
                t.removeEventListener(e, i, !!n)
            }, s.momentum = function(t, e, n, s, o, r) {
                var a, c, l = t - e,
                    h = i.abs(l) / n;
                return r = void 0 === r ? 6e-4 : r, a = t + h * h / (2 * r) * (0 > l ? -1 : 1), c = h / r, s > a ? (a = o ? s - o / 2.5 * (h / 8) : s, l = i.abs(a - t), c = l / h) : a > 0 && (a = o ? o / 2.5 * (h / 8) : 0, l = i.abs(t) + a, c = l / h), {
                    destination: i.round(a),
                    duration: c
                }
            };
            var a = n("transform");
            return s.extend(s, {
                hasTransform: a !== !1,
                hasPerspective: n("perspective") in o,
                hasTouch: "ontouchstart" in t,
                hasPointer: navigator.msPointerEnabled,
                hasTransition: n("transition") in o
            }), s.isBadAndroid = /Android /.test(t.navigator.appVersion) && !/Chrome\/\d/.test(t.navigator.appVersion), s.extend(s.style = {}, {
                transform: a,
                transitionTimingFunction: n("transitionTimingFunction"),
                transitionDuration: n("transitionDuration"),
                transitionDelay: n("transitionDelay"),
                transformOrigin: n("transformOrigin")
            }), s.hasClass = function(t, e) {
                var i = new RegExp("(^|\\s)" + e + "(\\s|$)");
                return i.test(t.className)
            }, s.addClass = function(t, e) {
                if (!s.hasClass(t, e)) {
                    var i = t.className.split(" ");
                    i.push(e), t.className = i.join(" ")
                }
            }, s.removeClass = function(t, e) {
                if (s.hasClass(t, e)) {
                    var i = new RegExp("(^|\\s)" + e + "(\\s|$)", "g");
                    t.className = t.className.replace(i, " ")
                }
            }, s.offset = function(t) {
                for (var e = -t.offsetLeft, i = -t.offsetTop; t = t.offsetParent;) e -= t.offsetLeft, i -= t.offsetTop;
                return {
                    left: e,
                    top: i
                }
            }, s.preventDefaultException = function(t, e) {
                for (var i in e)
                    if (e[i].test(t[i])) return !0;
                return !1
            }, s.extend(s.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,
                mousedown: 2,
                mousemove: 2,
                mouseup: 2,
                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            }), s.extend(s.ease = {}, {
                quadratic: {
                    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fn: function(t) {
                        return t * (2 - t)
                    }
                },
                circular: {
                    style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    fn: function(t) {
                        return i.sqrt(1 - --t * t)
                    }
                },
                back: {
                    style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fn: function(t) {
                        var e = 4;
                        return (t -= 1) * t * ((e + 1) * t + e) + 1
                    }
                },
                bounce: {
                    style: "",
                    fn: function(t) {
                        return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                    }
                },
                elastic: {
                    style: "",
                    fn: function(t) {
                        var e = .22,
                            n = .4;
                        return 0 === t ? 0 : 1 == t ? 1 : n * i.pow(2, -10 * t) * i.sin((t - e / 4) * (2 * i.PI) / e) + 1
                    }
                }
            }), s.tap = function(t, i) {
                var n = e.createEvent("Event");
                n.initEvent(i, !0, !0), n.pageX = t.pageX, n.pageY = t.pageY, t.target.dispatchEvent(n)
            }, s.click = function(t) {
                var i, n = t.target;
                /(SELECT|INPUT|TEXTAREA)/i.test(n.tagName) || (i = e.createEvent("MouseEvents"), i.initMouseEvent("click", !0, !0, t.view, 1, n.screenX, n.screenY, n.clientX, n.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null), i._constructed = !0, n.dispatchEvent(i))
            }, s
        }();
    n.prototype = {
        version: "5.1.1",
        _init: function() {
            this._initEvents()
        },
        destroy: function() {
            this._initEvents(!0), this._execEvent("destroy")
        },
        _transitionEnd: function(t) {
            t.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
        },
        _start: function(t) {
            if ((1 == o.eventType[t.type] || 0 === t.button) && this.enabled && (!this.initiated || o.eventType[t.type] === this.initiated)) {
                !this.options.preventDefault || o.isBadAndroid || o.preventDefaultException(t.target, this.options.preventDefaultException) || t.preventDefault();
                var e, n = t.touches ? t.touches[0] : t;
                this.initiated = o.eventType[t.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = o.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, e = this.getComputedPosition(), this._translate(i.round(e.x), i.round(e.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = n.pageX, this.pointY = n.pageY, this._execEvent("beforeScrollStart")
            }
        },
        _move: function(t) {
            if (this.enabled && o.eventType[t.type] === this.initiated) {
                this.options.preventDefault && t.preventDefault();
                var e, n, s, r, a = t.touches ? t.touches[0] : t,
                    c = a.pageX - this.pointX,
                    l = a.pageY - this.pointY,
                    h = o.getTime();
                if (this.pointX = a.pageX, this.pointY = a.pageY, this.distX += c, this.distY += l, s = i.abs(this.distX), r = i.abs(this.distY), !(h - this.endTime > 300 && 10 > s && 10 > r)) {
                    if (this.directionLocked || this.options.freeScroll || (s > r + this.options.directionLockThreshold ? this.directionLocked = "h" : r >= s + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"), "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough) t.preventDefault();
                        else if ("horizontal" == this.options.eventPassthrough) return void(this.initiated = !1);
                        l = 0
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough) t.preventDefault();
                        else if ("vertical" == this.options.eventPassthrough) return void(this.initiated = !1);
                        c = 0
                    }
                    c = this.hasHorizontalScroll ? c : 0, l = this.hasVerticalScroll ? l : 0, e = this.x + c, n = this.y + l, (e > 0 || e < this.maxScrollX) && (e = this.options.bounce ? this.x + c / 3 : e > 0 ? 0 : this.maxScrollX), (n > 0 || n < this.maxScrollY) && (n = this.options.bounce ? this.y + l / 3 : n > 0 ? 0 : this.maxScrollY), this.directionX = c > 0 ? -1 : 0 > c ? 1 : 0, this.directionY = l > 0 ? -1 : 0 > l ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(e, n), h - this.startTime > 300 && (this.startTime = h, this.startX = this.x, this.startY = this.y)
                }
            }
        },
        _end: function(t) {
            if (this.enabled && o.eventType[t.type] === this.initiated) {
                this.options.preventDefault && !o.preventDefaultException(t.target, this.options.preventDefaultException) && t.preventDefault();
                var e, n, s = (t.changedTouches ? t.changedTouches[0] : t, o.getTime() - this.startTime),
                    r = i.round(this.x),
                    a = i.round(this.y),
                    c = i.abs(r - this.startX),
                    l = i.abs(a - this.startY),
                    h = 0,
                    d = "";
                if (this.isInTransition = 0, this.initiated = 0, this.endTime = o.getTime(), !this.resetPosition(this.options.bounceTime)) return this.scrollTo(r, a), this.moved ? this._events.flick && 200 > s && 100 > c && 100 > l ? void this._execEvent("flick") : (this.options.momentum && 300 > s && (e = this.hasHorizontalScroll ? o.momentum(this.x, this.startX, s, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: r,
                    duration: 0
                }, n = this.hasVerticalScroll ? o.momentum(this.y, this.startY, s, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: a,
                    duration: 0
                }, r = e.destination, a = n.destination, h = i.max(e.duration, n.duration), this.isInTransition = 1), r != this.x || a != this.y ? ((r > 0 || r < this.maxScrollX || a > 0 || a < this.maxScrollY) && (d = o.ease.quadratic), void this.scrollTo(r, a, h, d)) : void this._execEvent("scrollEnd")) : (this.options.tap && o.tap(t, this.options.tap), this.options.click && o.click(t), void this._execEvent("scrollCancel"))
            }
        },
        _resize: function() {
            var t = this;
            clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
                t.refresh()
            }, this.options.resizePolling)
        },
        resetPosition: function(t) {
            var e = this.x,
                i = this.y;
            return t = t || 0, !this.hasHorizontalScroll || this.x > 0 ? e = 0 : this.x < this.maxScrollX && (e = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? i = 0 : this.y < this.maxScrollY && (i = this.maxScrollY), e == this.x && i == this.y ? !1 : (this.scrollTo(e, i, t, this.options.bounceEasing), !0)
        },
        disable: function() {
            this.enabled = !1
        },
        enable: function() {
            this.enabled = !0
        },
        refresh: function() {
            this.wrapper.offsetHeight;
            this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = o.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition()
        },
        on: function(t, e) {
            this._events[t] || (this._events[t] = []), this._events[t].push(e)
        },
        off: function(t, e) {
            if (this._events[t]) {
                var i = this._events[t].indexOf(e);
                i > -1 && this._events[t].splice(i, 1)
            }
        },
        _execEvent: function(t) {
            if (this._events[t]) {
                var e = 0,
                    i = this._events[t].length;
                if (i)
                    for (; i > e; e++) this._events[t][e].apply(this, [].slice.call(arguments, 1))
            }
        },
        scrollBy: function(t, e, i, n) {
            t = this.x + t, e = this.y + e, i = i || 0, this.scrollTo(t, e, i, n)
        },
        scrollTo: function(t, e, i, n) {
            n = n || o.ease.circular, this.isInTransition = this.options.useTransition && i > 0, !i || this.options.useTransition && n.style ? (this._transitionTimingFunction(n.style), this._transitionTime(i), this._translate(t, e)) : this._animate(t, e, i, n.fn)
        },
        scrollToElement: function(t, e, n, s, r) {
            if (t = t.nodeType ? t : this.scroller.querySelector(t)) {
                var a = o.offset(t);
                a.left -= this.wrapperOffset.left, a.top -= this.wrapperOffset.top, n === !0 && (n = i.round(t.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), s === !0 && (s = i.round(t.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), a.left -= n || 0, a.top -= s || 0, a.left = a.left > 0 ? 0 : a.left < this.maxScrollX ? this.maxScrollX : a.left, a.top = a.top > 0 ? 0 : a.top < this.maxScrollY ? this.maxScrollY : a.top, e = void 0 === e || null === e || "auto" === e ? i.max(i.abs(this.x - a.left), i.abs(this.y - a.top)) : e, this.scrollTo(a.left, a.top, e, r)
            }
        },
        _transitionTime: function(t) {
            t = t || 0, this.scrollerStyle[o.style.transitionDuration] = t + "ms", !t && o.isBadAndroid && (this.scrollerStyle[o.style.transitionDuration] = "0.001s")
        },
        _transitionTimingFunction: function(t) {
            this.scrollerStyle[o.style.transitionTimingFunction] = t
        },
        _translate: function(t, e) {
            this.options.useTransform ? this.scrollerStyle[o.style.transform] = "translate(" + t + "px," + e + "px)" + this.translateZ : (t = i.round(t), e = i.round(e), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = e + "px"), this.x = t, this.y = e
        },
        _initEvents: function(e) {
            var i = e ? o.removeEvent : o.addEvent,
                n = this.options.bindToWrapper ? this.wrapper : t;
            i(t, "orientationchange", this), i(t, "resize", this), this.options.click && i(this.wrapper, "click", this, !0), this.options.disableMouse || (i(this.wrapper, "mousedown", this), i(n, "mousemove", this), i(n, "mousecancel", this), i(n, "mouseup", this)), o.hasPointer && !this.options.disablePointer && (i(this.wrapper, "MSPointerDown", this), i(n, "MSPointerMove", this), i(n, "MSPointerCancel", this), i(n, "MSPointerUp", this)), o.hasTouch && !this.options.disableTouch && (i(this.wrapper, "touchstart", this), i(n, "touchmove", this), i(n, "touchcancel", this), i(n, "touchend", this)), i(this.scroller, "transitionend", this), i(this.scroller, "webkitTransitionEnd", this), i(this.scroller, "oTransitionEnd", this), i(this.scroller, "MSTransitionEnd", this)
        },
        getComputedPosition: function() {
            var e, i, n = t.getComputedStyle(this.scroller, null);
            return this.options.useTransform ? (n = n[o.style.transform].split(")")[0].split(", "), e = +(n[12] || n[4]), i = +(n[13] || n[5])) : (e = +n.left.replace(/[^-\d.]/g, ""), i = +n.top.replace(/[^-\d.]/g, "")), {
                x: e,
                y: i
            }
        },
        _animate: function(t, e, i, n) {
            function r() {
                var u, p, m, _ = o.getTime();
                return _ >= d ? (a.isAnimating = !1, a._translate(t, e), void(a.resetPosition(a.options.bounceTime) || a._execEvent("scrollEnd"))) : (_ = (_ - h) / i, m = n(_), u = (t - c) * m + c, p = (e - l) * m + l, a._translate(u, p), void(a.isAnimating && s(r)))
            }
            var a = this,
                c = this.x,
                l = this.y,
                h = o.getTime(),
                d = h + i;
            this.isAnimating = !0, r()
        },
        handleEvent: function(t) {
            switch (t.type) {
                case "touchstart":
                case "MSPointerDown":
                case "mousedown":
                    this._start(t);
                    break;
                case "touchmove":
                case "MSPointerMove":
                case "mousemove":
                    this._move(t);
                    break;
                case "touchend":
                case "MSPointerUp":
                case "mouseup":
                case "touchcancel":
                case "MSPointerCancel":
                case "mousecancel":
                    this._end(t);
                    break;
                case "orientationchange":
                case "resize":
                    this._resize();
                    break;
                case "transitionend":
                case "webkitTransitionEnd":
                case "oTransitionEnd":
                case "MSTransitionEnd":
                    this._transitionEnd(t);
                    break;
                case "wheel":
                case "DOMMouseScroll":
                case "mousewheel":
                    this._wheel(t);
                    break;
                case "keydown":
                    this._key(t);
                    break;
                case "click":
                    t._constructed || (t.preventDefault(), t.stopPropagation())
            }
        }
    }, n.utils = o, "undefined" != typeof module && module.exports ? module.exports = n : t.IScroll = n
}(window, document, Math);