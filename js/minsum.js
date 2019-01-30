(function ($) {
    $.minsum = {
        options: {
            cart_actions: [],
            checkout_selector: '',
            is_cart: false,
            is_onestep: false,
            is_ss8order: false,
            onestep_url: '',
            order_calculate_url: '',
            url: '',
            minsum_selector: '#minsum-cart'
        },
        init: function (options) {
            $.extend(this.options, options);

            if (!this.checkSettings()) {
                return false;
            }
            console.log('minsum init:');
            console.log(this.options);

            if (this.options.is_ss8order) {
                this.orderCalculate();
            } else if (this.options.is_cart) {
                this.cartActions();
            } else if (this.options.is_onestep) {
                this.onestepComplete();
            }
            this.checkCart();
        },
        checkSettings: function () {
            /*Проверка наличия плагина заказ на одной странице*/
            if ($('.onestep-cart').length) {
                this.options.is_onestep = true;
            } else if ($('#wa-order-form-wrapper').length) {
                /*Проверка одностраничного оформления заказа в Shop-Script 8*/
                this.options.is_ss8order = true;
                this.options.checkout_selector = '.wa-actions-section .js-submit-order-button';
            } else {
                this.options.is_cart = true;
                if (!$(this.options.checkout_selector).length) {
                    console.log('Указанный селектор не удалось найти "' + this.options.checkout_selector + '"');
                    console.log('Выполняется автоматический поиск.');
                    if ($('[name=checkout]').length) {
                        console.log('Найден [name=checkout]');
                        this.options.checkout_selector = '[name=checkout]';
                    } else {
                        console.log('Селектор checkout_selector не найден');
                        return false;
                    }
                }
            }
            return true;
        },
        orderCalculate: function () {
            var minsum = this;
            console.log('minsum init orderCalculate');
            $(document).ajaxComplete(function (event, xhr, settings) {
                console.log('minsum orderCalculate:');
                console.log(settings);
                console.log(settings.url === minsum.options.order_calculate_url);
                if (settings.url === minsum.options.order_calculate_url) {
                    minsum.checkCart();
                }
            });
        },
        onestepComplete: function () {
            var minsum = this;
            console.log('minsum init onestepComplete');
            $(document).ajaxComplete(function (event, xhr, settings) {
                console.log('minsum onestepComplete:');
                console.log(settings);
                console.log(settings.url.indexOf(minsum.options.onestep_url));
                if (settings.url.indexOf(minsum.options.onestep_url) != -1) {
                    minsum.checkCart();
                }
            });
        },
        cartActions: function () {
            var minsum = this;
            console.log('minsum init cartActions');
            $(document).ajaxComplete(function (event, xhr, settings) {
                console.log('minsum cartActions:');
                console.log(settings);
                console.log($.inArray(settings.url, minsum.options.cart_actions));
                if ($.inArray(settings.url, minsum.options.cart_actions) != -1) {
                    minsum.checkCart();
                }
            });
        },
        disableCheckout: function (loading, message) {
            if (!$('#minsum-cart').length) {
                if (this.options.is_onestep) {
                    $('.onestep-cart .onestep-cart-form').after('<div id="minsum-cart" class="hidden" style="display:none;"></div>');
                } else {
                    $(this.options.checkout_selector).after('<div id="minsum-cart" class="hidden" style="display:none;"></div>');
                }
            }

            if ($('#minsum-cart-loading').length) {
                $('#minsum-cart-loading').remove();
            }
            if (message === undefined) {
                message = '';
            }
            if (loading === undefined) {
                loading = false;
            }
            if (this.options.is_onestep) {
                $('.onestep-cart .checkout').hide();
                $(this.options.minsum_selector).text(message);
                if (message) {
                    $(this.options.minsum_selector).removeClass('hidden').addClass('active').show();
                } else {
                    $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
                }
                if (loading && !$('#minsum-cart-loading').length) {
                    $('<span id="minsum-cart-loading"><i class="icon16 loading"></i> Пожалуйста, подождите...</span>').insertBefore('.onestep-cart .checkout');
                }
            } else {
                $(this.options.checkout_selector).attr('disabled', true);
                $(this.options.minsum_selector).text(message);
                if (message) {
                    $(this.options.minsum_selector).removeClass('hidden').addClass('active').show();
                } else {
                    $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
                }
                if (loading && !$('#minsum-cart-loading').length) {
                    $('<span id="minsum-cart-loading"><i class="icon16 loading"></i> Пожалуйста, подождите...</span>').insertBefore(this.options.checkout_selector);
                }
            }
        },
        enableCheckout: function () {
            if ($('#minsum-cart-loading').length) {
                $('#minsum-cart-loading').remove();
            }
            $(this.options.minsum_selector).text('');
            $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
            if (this.options.is_onestep) {
                $('.onestep-cart .checkout').show();
            } else {
                $(this.options.checkout_selector).removeAttr('disabled');
            }
        },
        checkCart: function () {
            var minsum = this;
            this.disableCheckout(true);
            $.ajax({
                type: 'POST',
                url: minsum.options.url,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    if (data.data.check.result) {
                        minsum.enableCheckout();
                    } else {
                        minsum.disableCheckout(false, data.data.check.message);
                    }
                },
                error: function (jqXHR, errorText) {
                    minsum.enableCheckout();
                }
            });
        }
    };
})(jQuery);