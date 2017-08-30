// $('h1').click(function () {
//     alert(1)
// })

$(function () {



    //初始化页数，每页条数，尾页
    var pageNum = 1,
        pageSize = 10,
        endPage;
    //页面初始加载请求数据
    // $.ajax({
    //     url: 'http://192.168.1.127:8905/showItem',
    //     success: function (result) {
    //         console.log(result);
    //         var result = template('data-list', {
    //             list: result
    //         });
    //         $('#list').html(result);
    //     },
    //     error: function (error) {
    //         console.log(error)
    //     }
    // })

    //获取首页数据
    var getIndexData = {
        // url: 'http://192.168.1.127:8905/showItem',
        url: 'http://192.168.1.127:8905/showItem',
        data: {
            pageNum: pageNum || 1,
            pageSize: pageSize || 15
        },
        type: 'post',
        beforeSend: function () {
            $('.loading').show();
        },
        success: function (result) {
            console.log(result);
            var html = template('data-list', {
                list: result.list
            });
            $('#list').html(html);
            //计算尾页
            endPage = Math.ceil(result.total / pageSize);
            // console.log(endPage);
            $('.isPage').text(pageNum)
            $('.allPage').text(result.allPage)
        },
        error: function (error) {
            console.log(error)
        },
        complete: function () {
            $('.loading').hide();
        }
    };
    $.ajax(getIndexData);

    //点击首页
    $('.homePage').click(function () {
        pageNum = 1;
        $.ajax(getIndexData)
    })

    //点击上一页
    $('.previous').click(function () {

        if (pageNum == 1) {
            alert('当前页为首页')
            return false;
        } else {
            pageNum--;
        }
        var getPreData = {
            url: 'http://192.168.1.127:8905/showItem',
            data: {
                pageNum: pageNum || 1,
                pageSize: pageSize || 15
            },
            success: function (result) {
                // console.log(result);
                var html = template('data-list', {
                    list: result.list
                });
                $('#list').html(html);
                $('.isPage').text(pageNum)
                $('.allPage').text(result.allPage)
            },
            error: function (error) {
                alert("请求错误")
                console.log(error)
            }
        };
        $.ajax(getPreData);
    });

    //点击下一页
    $('.next').click(function () {
        if (pageNum >= endPage) {
            alert('当前页为最后一页')
            return false;
        } else {
            pageNum++;
        }
        var getNextData = {
            url: 'http://192.168.1.127:8905/showItem',
            data: {
                pageNum: pageNum || 1,
                pageSize: pageSize || 15
            },
            success: function (result) {
                // console.log(result);
                var html = template('data-list', {
                    list: result.list
                });
                $('#list').html(html);
                $('.isPage').text(pageNum)
                $('.allPage').text(result.allPage)
            },
            error: function (error) {
                console.log(error)
            }
        };
        $.ajax(getNextData);
    });

    //点击尾页
    $('.end').click(function () {
        pageNum = endPage
        var getEndData = {
            url: 'http://192.168.1.127:8905/showItem',
            data: {
                pageNum: pageNum || 1,
                pageSize: pageSize || 15
            },
            success: function (result) {
                var html = template('data-list', {
                    list: result.list
                });
                $('#list').html(html);
                $('.isPage').text(pageNum)
                $('.allPage').text(result.allPage)
            },
            error: function (error) {
                console.log(error)
            }
        }
        $.ajax(getEndData);
    })

    //点击跳转页
    $('.go').click(function () {
        var val = $(this).prev().val();
        // console.log(val-0)
        // console.log(endPage)
        // console.log((parseInt($.trim(val)) - 0 < 1 ) || (parseInt($.trim(val)) - 0 > endPage))
        if ($.trim(val) == '' || ((parseInt($.trim(val)) - 0 < 1) || (parseInt($.trim(val)) - 0 > endPage))) {
            alert('请输入正确页码')
            return false;
        } else {
            pageNum = val;
            var getSelData = {
                url: 'http://192.168.1.127:8905/showItem',
                data: {
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 15
                },
                success: function (result) {
                    var html = template('data-list', {
                        list: result.list
                    });
                    $('#list').html(html);
                    $('.isPage').text(pageNum)
                    $('.allPage').text(result.allPage)
                },
                error: function (error) {
                    console.log(error)
                },
                // complated: function () {
                //     console.log()
                // }
            }
        }
        $.ajax(getSelData);
        $('.gotoPage').val('')
    })


    //添加数据
    $('.addBtn').on('click', function () {
        //请求数据类型、行业、指标名称、区域相关数据；
        var one = {
            datatype: '#datatype',
            indusName: '#indusName',
            indexName: '#indexName',
            province: '#province',
            city: '#city',
            county: '#county'
        }
        getItemData(one)
    })

    //点击保存按钮 
    $('#save').click(function () {
        // var itemName=$('input[name="itemName"]').val();
        // if(!$.trim(itemName)){
        //     alert('项目名称不能为空')
        //     return 
        // }
        //获取用户填写的数据

        $("#frequency").val($(".frequency option:selected").val());
        $(".datatype").val($("#datatype option:selected").attr('typeId'));
        $(".industry").val($("#indusName option:selected").attr('indusId'));
        $(".indexName").val($("#indexName option:selected").attr('indexId'));
        var countyId=$("#county option:selected").attr('countyId')
        var cityId=$("#city option:selected").attr('cityId')
        var proId=$("#province option:selected").attr('proId')
        if(countyId){
            $(".area").val(countyId)
        }else if(cityId){
            $(".area").val(cityId)
        }else if(proId){
            $(".area").val(proId)
        }else{
            alert('请填入项目所属区域')
            return 
        }

        // console.log($('#province option:selected').attr('proId'))
        // console.log($("#frequency option:selected"))
        // console.log($("#frequency option:selected").val())
        var formData = $('#formAdd').serialize();
        console.log(formData);
        //保存数据发起ajax请求
        var saveData = {
            url: 'http://192.168.1.127:8905/addItemSave',
            type: 'post',
            data: formData,
            success: function (result) {
                console.log(result);
            }
        }
        $.ajax(saveData);
        $('#add').modal('hide')
        $('#formAdd input').val('');
        $('#formAdd .outer select').html('<option>请选择</option>')
        $.ajax(getIndexData)
    })

    // 点击编辑
    $('#list').on('click', '.showModal', function () {

        $('#formEdit input').val('');
        $('#formEdit .outer select').html('<option>请选择</option>')
        var This = $(this);

        //弹出编辑模态框
        $('#edit').modal();

        var editSelector = {
            datatype: '#edit_datatype',
            indusName: '#edit_indusName',
            indexName: '#edit_indexName',
            province: '#edit_province',
            city: '#edit_city',
            county: '#edit_county'
        }

        getItemData(editSelector, function () {

            //通过省id来获取全部市的数据
            // var proId = $('#edit_province').find('option:selected').attr('proId');
            var proId=$('#formEdit input[name="areaName"]').val();

            console.log(proId)
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
                    $('#edit_city').html('<option>请选择</option>' + city)
                }
            }
            $.ajax(getCityData)


            var itemId = This.parent().parent().attr('id')
            var itemData = {
                url: 'http://192.168.1.127:8905/itemUpdateView',
                data: itemId,
                success: function (result) {
                    console.log(result);
                    // {"itemId":1,"itemName":"期货成交量：铁矿石","itemUnit":"手",
                    // "frequencyName":"日","frequencyId":6,"datatypeName":"原始值",
                    // "datatypeId":1,"indusName":"黑色金属矿采选业","indusId":4,"indexName":"产出",
                    // "indexId":1,"itemCode":"S0186248","areaName":"北京市","areaId":1}

                    $('#formEdit input[name="itemName"]').val(result.itemName);
                    $('#formEdit input[name="itemUnit"]').val(result.itemUnit);
                    $('#formEdit input[name="itemCode"]').val(result.itemCode);
                    $('.frequency').val(result.frequencyName);
                    $('#edit_datatype').val(result.datatypeName);
                    $('#edit_indusName').val(result.indusName);
                    $('#edit_indexName').val(result.indexCode);

                    //渲染地区数据 获取地区长度
                    var areaLength=result.areaView.length;
                    console.log(areaLength);
                    if(areaLength==3){
                        var proJson=result.areaView[0];
                        $('#edit_province').val(proJson.areaName)
                        var cityJson=result.areaView[1];
                        $('#edit_city').html('<option>'+cityJson.areaName+'</option>')
                        var countyJson=result.areaView[2];
                        $('#edit_county').html('<option>'+countyJson.areaName+'</option>')
                        
                    }else if(areaLength==2){
                        var proJson=result.areaView[0];
                        $('#edit_province').val(proJson.areaName)
                        var cityJson=result.areaView[1];
                        $('#edit_city').html('<option>'+cityJson.areaName+'</option>')
                    }else{
                        console.log('进来了')
                        var proJson=result.areaView[0];
                        $('#edit_province').val(proJson.areaName)
                        $('#formEdit input[name="areaName"]').val(proJson.areaId);
                    }
                    // var result = template('data-list', {
                    //     list: result
                    // });
                    // $('#list').html(result);
                },
                error: function (error) {
                    console.log(error)
                }
            }
            $.ajax(itemData);
        })

        //获取item相关数据

    })
    //点击删除按钮
    // $('')





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
                //编辑页中还需要通过省来获取全部市的数据
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
            $.ajax({
                url: 'http://192.168.1.127:8905/getArea',
                data: {
                    areaId: cityId
                },
                success: function (result) {
                    console.log(result)
                    var county = template('county-list', {
                        county_list: result
                    });
                    $(option.county).html(county)
                }
            })
        })
    }
    //2.计算json对象的长度
    function jsonLength(json){
        var jsonLength=0;
        for(var k in json){
            jsonLength++;
        }
        return jsonLength;
    }

})