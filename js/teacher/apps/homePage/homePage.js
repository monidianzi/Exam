/**
 * @author Guo Yuchun
 * @date   2018/7/23
 * @Description:
 */
require(['less!homePageStyle']);

define([
    'text!homePageView'
],function (
    _view
) {
    return {
        template: _view,
        data: function () {
            return {}

        },

    }
})