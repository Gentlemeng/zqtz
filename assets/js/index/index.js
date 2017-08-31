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
        // beforeSend: function () {
        //     $('.loading').show();
        // },
        success: function (result) {
            console.log(result);
            var html = template('data-list', {
                list: result.list
            });
            $('#list').html(html);
            //计算尾页
            endPage = Math.ceil(result.total / pageSize);
            // console.log(endPage);
            console.log(pageNum)
            $('.isPage').text(pageNum)
            $('.allPage').text(result.allPage)
        },
        error: function (error) {
            console.log(error)
        },
        // complete: function () {
        //     $('.loading').hide();
        // }
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
        var val = $('.gotoPage').val();
        console.log(val - 0)
        // console.log(endPage)
        // console.log((parseInt($.trim(val)) - 0 < 1 ) || (parseInt($.trim(val)) - 0 > endPage))
        if ($.trim(val) == '' || ((parseInt($.trim(val)) - 0 < 1) || (parseInt($.trim(val)) - 0 > endPage))) {
            alert('请输入正确页码')
            return false;
        } else {
            skipByPageNum();
        }
        $('.gotoPage').val('')
    })

    //点击添加按钮
    $('.addBtn').on('click', function () {
        //请求数据类型、行业、指标名称、区域相关数据；
        var addSelector = {
            datatype: '#datatype',
            indusName: '#indusName',
            indexName: '#indexName',
            province: '#province',
            city: '#city',
            county: '#county'
        }
        getItemData(addSelector)
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
        var countyId = $("#county option:selected").attr('countyId')
        var cityId = $("#city option:selected").attr('cityId')
        var proId = $("#province option:selected").attr('proId')
        if (countyId) {
            $(".area").val(countyId)
        } else if (cityId) {
            $(".area").val(cityId)
        } else if (proId) {
            $(".area").val(proId)
        } else {
            alert('请填入项目所属区域')
            return
        }
        var formData = $('#formAdd').serialize();
        console.log(formData);
        //保存数据发起ajax请求
        var saveData = {
            url: 'http://192.168.1.127:8905/addItemSave',
            type: 'post',
            data: formData,
            success: function (result) {
                console.log("保存成功");
            }
        }
        $.ajax(saveData);
        //隐藏模态框
        $('#add').modal('hide')
        //清空输入框
        $('#formAdd input').val('');
        //初始化区域选择框
        $('#formAdd .outer select').html('<option>请选择</option>')
        //保存后进行页面渲染
        pageNum = 1;
        $.ajax(getIndexData)
    })

    // 点击编辑按钮
    $('#list').on('click', '.showModal', function () {
        //获取当前页
        var editPageNum = $('.isPage').val();
        $('#formEdit input').val('');
        $('#formEdit .outer select').html('<option>请选择</option>')
        var itemId = $(this).parent().parent().attr('id');
        // console.log(itemId);
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
        //编辑时项目渲染
        getItemData(editSelector, function () {
            // var itemId = This.
            var itemData = {
                url: 'http://192.168.1.127:8905/itemUpdateView',
                data: itemId,
                success: function (itemResult) {
                    console.log(itemResult);
                    $('#formEdit input[name="itemName"]').val(itemResult.itemName);
                    $('#formEdit input[name="itemUnit"]').val(itemResult.itemUnit);
                    $('#formEdit input[name="itemCode"]').val(itemResult.itemCode);
                    $('.frequency').val(itemResult.frequencyName);
                    $('#edit_datatype').val(itemResult.datatypeName);
                    $('#edit_indusName').val(itemResult.indusName);
                    $('#edit_indexName').val(itemResult.indexCode);

                    //渲染地区数据 获取地区长度
                    var areaLength = itemResult.areaView.length;
                    console.log(areaLength);
                    if (areaLength == 3) {
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName)

                        //通过传过来的省id获取渲染全部市，并显示默认市
                        var proId = $('#edit_province').find('option:selected').attr('proId');
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
                                // 渲染全部市
                                $('#edit_city').html(city)
                                //显示默认市
                                var cityJson = itemResult.areaView[1];
                                $('#edit_city').val(cityJson.areaName);

                                //通过获取到市id渲染全部的县，并显示默认县
                                var cityId = itemResult.areaView[1].areaId;
                                console.log(cityId);
                                var getEditCountyData = {
                                    url: 'http://192.168.1.127:8905/getArea',
                                    data: {
                                        areaId: cityId
                                    },
                                    success: function (result) {
                                        // alert(1);
                                        console.log(result)
                                        var county = template('county-list', {
                                            county_list: result
                                        });
                                        // 渲染全部市
                                        $('#edit_county').html(county)
                                        //显示默认市
                                        var countyJson = itemResult.areaView[2];
                                        $('#edit_county').val(countyJson.areaName)
                                    }
                                }
                                $.ajax(getEditCountyData)
                            },
                            error: function () {
                                console.log(error);
                            }
                        }
                        $.ajax(getCityData)
                    } else if (areaLength == 2) {
                        //显示省
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName)

                        //通过传过来的省id获取市，并显示默认市
                        var proId = $('#edit_province').find('option:selected').attr('proId');
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
                                // 渲染全部市
                                $('#edit_city').html(city)
                                //显示默认市
                                var cityJson = itemResult.areaView[1];
                                $('#edit_city').val(cityJson.areaName)
                            }
                        }
                        $.ajax(getCityData)
                        //显示市
                        // var cityJson=itemResult.areaView[1];
                        // $('#edit_city').html('<option>'+cityJson.areaName+'</option>')
                    } else {
                        console.log('进来了')
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName)
                        $('#formEdit input[name="areaName"]').val(proJson.areaId);
                        //通过传过来的省id获取渲染全部市，并显示默认市
                        var proId = itemResult.areaView[0].areaId;
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
                                // 渲染全部市
                                $('#edit_city').html('<option>请选择</option>'+city)
                            },
                            error: function () {
                                console.log(error);
                            }
                        }
                        $.ajax(getCityData)
                    }
                },
                error: function (error) {
                    console.log(error)
                }
            }
            $.ajax(itemData);
        })
        // 点击更新按钮
        $('#update').click(function () {
            if (!$.trim($('#edit input[name="itemName"]').val())) {
                alert('请输入项目名称')
                return
            }
            // console.log(itemId);
            $("#itemId").val(itemId)
            $("#edit_fre").val($("#edit .frequency option:selected").val());
            $("#edit .datatype").val($("#edit_datatype option:selected").attr('typeId'));
            $("#edit .industry").val($("#edit_indusName option:selected").attr('indusId'));
            $("#edit .indexName").val($("#edit_indexName option:selected").attr('indexId'));
            var countyId = $("#edit_county option:selected").attr('countyId')
            var cityId = $("#edit_city option:selected").attr('cityId')
            var proId = $("#edit_province option:selected").attr('proId')
            if (countyId) {
                $("#edit .area").val(countyId)
            } else if (cityId) {
                $("#edit .area").val(cityId)
            } else if (proId) {
                $("#edit .area").val(proId)
            } else {
                alert('请填入项目所属区域')
                return
            }

            var editFormData = $('#formEdit').serialize();
            // console.log(editFormData);
            var updataData = {
                url: 'http://192.168.1.127:8905/updateItemSave',
                type: 'post',
                data: editFormData,
                success: function (result) {
                    // console.log(result);
                    skipByPageNum();
                }
            }
            $.ajax(updataData);
            $('#edit').modal('hide')

        })
    })

    //点击删除按钮
    $('#list').on('click', '.delete', function () {
        if (confirm("确定删除数据")) {
            var deleteId = $(this).parent().parent().attr('id');
            console.log(deleteId);
            var deleteData = {
                url: 'http://192.168.1.127:8905/deleteItemList',
                type: 'post',
                data: deleteId,
                success: function (result) {
                    console.log(result)
                    // $.ajax(getIndexData)
                    // alert('删除成功')
                    if (result.status === 'success') {
                        alert('删除成功');
                    } else if (result.status === 'fail') {
                        alert('删除失败')
                    }
                },
                error: function (error) {
                    consoel.log(error)
                }
            }
            $.ajax(deleteData)
            //删除后进行页面渲染
            pageNum = 1;
            $.ajax(getIndexData)
            // $.ajax(getIndexData);
        }

    })

    //封装
     //跳转到指定页
     function skipByPageNum() {
        var pageNum = $('.gotoPage').val();
        var currentNum = $('.isPage').val();
        var getSelData = {
            url: 'http://192.168.1.127:8905/showItem',
            data: {
                pageNum: pageNum || currentNum || 1,
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
        $.ajax(getSelData);
    }
})