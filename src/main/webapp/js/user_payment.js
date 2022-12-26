$(function() {
    let currentPage = 1
    function showList(currentPage) {
        $.ajax({
            url: backURL + 'wallet/list/' + currentPage,
            xhrFields: {
                withCredentials: true,
            },
            data : {
                'currentPage' : currentPage
            },
            success: function(jsonObj) {
                console.log(jsonObj)
                let $trOrigin = $('table > tbody > tr:eq(0)')
                $trOrigin.show()
                $('table > tbody').html('')
                let walletList = jsonObj.list
                $(walletList).each(function(index, item) {
                    let $trCopy = $trOrigin.clone();
                    $trCopy.find('td:eq(0)').html(item.transactionNo)
                    $trCopy.find('td:eq(1)').html(item.transactionDate)
                    let oldBalance = 0
                    let priceStr = ''
                    let categoryStr = ''
                    switch(item.transactionCategory) {
                        case 1:
                        case 3:
                        case 5:
                            priceStr += '+' + item.transactionMoney
                            oldBalance = item.walletBalance - item.transactionMoney
                            break;
                        case 2:
                        case 4:
                            priceStr += '-' + item.transactionMoney
                            oldBalance = item.walletBalance + item.transactionMoney
                            break;
                    }
                    switch(item.transactionCategory) {
                        case 1:
                            categoryStr = '정산금액(환급금)'
                            break;
                        case 2:
                            categoryStr = '입장료'
                            break;
                        case 3:
                            categoryStr = '충전금'
                            break;
                        case 4:
                            categoryStr = '인출금'
                            break;
                        case 5:
                            categoryStr = '환불금'
                            break;
                    }
                    $trCopy.find('td:eq(2)').html(categoryStr)
                    if(item.study != null) {
                        $trCopy.find('td:eq(3)').html(item.study.studyTitle)
                    } else {
                        $trCopy.find('td:eq(4)').html(item.transactionUser)
                    }
                    $trCopy.find('td:eq(5)').find('span:eq(0)').html('&#8361;' + oldBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $trCopy.find('td:eq(5)').find('span:eq(1)').html(priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $trCopy.find('td:eq(5)').find('span:eq(3)').html('&#8361;' + item.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $('table > tbody').append($trCopy)
                })
                //페이지 목록 만들기
                let startPage = jsonObj.startPage                //페이지 목록 그룹에서의 시작 페이지
                let endPage = jsonObj.endPage                    //페이지 목록 그룹에서의 끝 페이지
                let cntPerPageGroup = jsonObj.cntPerPageGroup    //페이지 그룹수
                let totalPage = jsonObj.totalPage;               //총페이지수

                let liStr = '';
                if(currentPage != 1) {
                    liStr += '<li class="PREV">PREV</li>'
                }
                for(let i=startPage; i<=endPage; i++){
                    liStr += (i==currentPage) ? '<li class="current">' + i + '</li>' : '<li class="' + i +'">' + i + '</li>'
                }
                if(currentPage < totalPage) {
                    liStr += '<li class="NEXT">NEXT</li>'
                }
                console.log(liStr)
                $('div.page_group_payment > ul').html(liStr)
            }, error: function(xhr) {
                alert(xhr)
            }
        })
    }
    showList(1)
    //—페이지 클릭이벤트 START—
    $('div.page_group_payment>ul').on('click', 'li', (e)=>{
        let clickPage = $(e.target).attr('class')
        if(clickPage == 'current') { return false }
        else if(clickPage == 'PREV') {
            currentPage = currentPage - 1
        }
        else if(clickPage == 'NEXT') {
            currentPage = currentPage + 1
        }
        else {
            currentPage = clickPage
        }
        alert(currentPage)
        showList(currentPage)
    })
    //—페이지 클릭이벤트 END—
})