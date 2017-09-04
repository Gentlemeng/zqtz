//封装
    //1.通过选择器获取元素，请求数据并动态渲染到元素上
    function getItemData(option, fn) {
        var getAddData = {
            url: 'http://192.168.1.127:8905/addItemEdit',
            type: 'get',
            success: function (result) {
                console.log(result);

                var dataType = template('type-list', {
                    //数组
                    data_list: result.dataType
                });
                $(option.datatype).html(dataType)

                var indusName = template('indus-list', {
                    //数组
                    indus_list: result.industry
                });
                $(option.indusName).html(indusName)

                var indexName = template('index-list', {
                    //数组
                    index_list: result.index
                });
                $(option.indexName).html(indexName)

                var province = template('pro-list', {
                    //数组
                    pro_list: result.area
                });
                $(option.province).append(province)
            },
            error: function (error) {
                console.log(error)

            },
            complete: function () {
                //编辑页中还需要通过省来获取全部市的数据，通过市来获取县
                if (fn) {
                    fn();
                }
            }
        }
        $.ajax(getAddData);

        // 获取市
        $(option.province).change(function () {
            //清空 市、县
            $(option.city).val('')
            $(option.county).html('<option>请选择</option>')
            // alert(1)
            var proId = $(option.province).find('option:selected').attr('proId');
            // console.log(proId)
            var getCityData = {
                url: 'http://192.168.1.127:8905/getArea',
                data: {
                    areaId: proId
                },
                success: function (result) {
                    console.log(result)
                    var city = template('city-list', {
                        city_list: result
                    });
                    // console.log(city);
                    $(option.city).html('<option>请选择</option>' + city)
                }
            }
            $.ajax(getCityData)
        })

        //获取县（区）
        $(option.city).change(function () {
            var cityId = $(option.city).find('option:selected').attr('cityId')
            // console.log(cityId)
            var getCountyData = {
                url: 'http://192.168.1.127:8905/getArea',
                data: {
                    areaId: cityId
                },
                success: function (result) {
                    console.log(result)
                    var county = template('county-list', {
                        county_list: result
                    });
                    $(option.county).html('<option>请选择</option>' + county)
                }
            }
            $.ajax(getCountyData)
        })
    }

    //2.计算json对象的长度
    function jsonLength(json) {
        var jsonLength = 0;
        for (var k in json) {
            jsonLength++;
        }
        return jsonLength;
    }

    
   