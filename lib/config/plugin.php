<?php

/**
 * @author wa-plugins.ru <support@wa-plugins.ru>
 * @link http://wa-plugins.ru/
 */
return array(
    'name' => 'Минимальная сумма заказа',
    'description' => 'Установка ограничения на минимальную сумму заказа',
    'img' => 'img/minsum.png',
    'vendor' => '985310',
    'version' => '1.0.0',
    'rights' => false,
    'frontend' => true,
    'shop_settings' => true,
    'handlers' => array(
        'frontend_cart' => 'frontendCart',
        'frontend_checkout' => 'frontendCheckout',
    )
);
