let operationModel = {
    _vc :null,
    _viewer:null,
    _selectSet :null,


    init(viewer){
        this._vc = new window.Web3D.VisibilityController(viewer,0.5);
        this._viewer = viewer;
        this._selectSet = viewer.Selection.Current;
    },

    _hide(reverse) {
        if (reverse) this._vc.HidenSet.clear();
        this._vc.HidenSet.add(...this._selectSet);
        if (reverse) this._vc.reverse_hiden();
        this._viewer.redraw();
    },
    _transp(reverse) {
        if (reverse) this._vc.TransparentSet.clear();
        this._vc.TransparentSet.add(...this._selectSet);
        if (reverse) this._vc.reverse_transparent();
        this._viewer.redraw();
    },
    _reset() {
        this._vc.reset();
        this._viewer.redraw();
    },
    _sel_sth() {
        return this._selectSet.size > 0;
    },
}

export {operationModel}
