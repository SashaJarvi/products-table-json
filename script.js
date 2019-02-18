$(document).ready(function() {

    fetch("products.json")
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            drawTable(data);
            function drawTable(data) {
                for (let i = 0; i < data.length; i++) {
                    drawRow(i+1, data[i]);
                }
            }

            function drawRow(index, rowData) {
                let row = $("<tr class='table-data' />"),
                    productSum = rowData.quantity * rowData.price;
                $(".products_table tbody").append(row);
                row.append($("<td>" + index + "</td>"));
                row.append($("<td>" + rowData.name + "</td>"));
                row.append($("<td>" + rowData.quantity + "</td>"));
                row.append($("<td>" + rowData.price + "</td>"));
                row.append($("<td>" + productSum + "</td>"));
            }

            let table = $('.products_table').DataTable({
                paging: false,
                lengthChange: false,
                ordering: false,
                bInfo: false,
                language: {
                    zeroRecords: "Нет данных, попадающих под условие фильтра"
                }
            });

            let priceFrom = $('.price-from'),
                priceTo = $('.price-to');

            $.fn.dataTable.ext.search.push(
                function( settings, data, dataIndex ) {
                    let min = parseInt( priceFrom.val(), 10 ),
                        max = parseInt( priceTo.val(), 10 ),
                        columns = [
                            'ID',
                            'NAME',
                            'QUANTITY',
                            'PRICE',
                            'SUM'
                        ],
                        priceForItem = parseFloat( data[columns.indexOf('PRICE')] ) || 0;

                    return (isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && priceForItem <= max) ||
                        (min <= priceForItem && isNaN(max)) ||
                        (min <= priceForItem && priceForItem <= max) ||
                        (!min && !max);
                }
            );

            $('form').validate({
                errorElement: "div",

                errorPlacement: function(error, element) {
                    $('.error-messages').append(error);
                },

                submitHandler: function() {
                    console.log("Таблица успешно обновлена!")
                }
            });

            $('.validating').each(function() {
                $(this).rules('add', {
                    number: true,
                    messages: {
                        number: "Введите цифры"
                    },
                });
            });


            $('.refresh').click(function() {
                table.draw();
            });

            $.merge(priceFrom, priceTo).keydown(function(event) {
                if(event.key === "Enter") {
                    table.draw();
                }
            });
        });
});