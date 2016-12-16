<?php

class shopMinsum {

    /**
     * Проверка текущего заказ на соответсвие минимальным требованиям.
     * Возвращает result = TRUE - если условия минимального заказа выполняются, FALSE - если условия не выполняются.
     * message - сообщение об ошибке.
     * 
     * @return array('result' => boolean, 'message' => string)
     */
    public static function checkOrder() {
        $return = array(
            'result' => true,
            'message' => '',
        );

        $route_hash = null;
        if (shopMinsumRouteHelper::getRouteSettings(null, 'status')) {
            $route_hash = null;
            $route_settings = shopMinsumRouteHelper::getRouteSettings();
        } elseif (shopMinsumRouteHelper::getRouteSettings(0, 'status')) {
            $route_hash = 0;
            $route_settings = shopMinsumRouteHelper::getRouteSettings(0);
        } else {
            return $return;
        }

        $cart = new shopCart();
        $primary_currency = $route_settings['currency'];
        $frontend_currency = wa('shop')->getConfig()->getCurrency(false);

        $total = $cart->total(true);
        $total = shop_currency($total, $frontend_currency, $primary_currency, false);
        $min_order_sum = $route_settings['min_order_sum'];
        $min_order_sum_format = shop_currency($min_order_sum, $primary_currency, $frontend_currency);

        if ($total < $min_order_sum) {
            $return['result'] = false;
            $return['message'] = sprintf($route_settings['min_order_sum_message'], $min_order_sum_format);
        }
        return $return;
    }

}
