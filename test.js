/**
 * @file		jquery.paging.js
 * @brief		아프리카 모바일 이벤트 페이징 플러그인 / json데이터 파싱형
 * @author		MoonHS
 * @bug			[ ]
 * @todo		[ 페이징 디자인 변경필요. ex)버튼 이미지 ]
 * @warning		[ ]
 *
 */
(function($) {
	// Private Values
	// 페이징 관련 변수
	var _nCurrentPageNo = 1;		// 현재 페이지 번호
	var _nLimit = 50; 				// 페이지 당 노출시킬 레코드 개수
	var _nTotalListCnt= -1;		// 검색된 총 방송로그 개수
	var _nTotalPage =  -1;			// 총 페이지 번호
	var _nBlockCnt = 5;				// 페이징 블럭 개수
	var _szPrintDivName = "";		// 페이징 리스트를 노출시킬 DOM ID
	var _fnCallBack = null;			// 페이지 이동시 수행할 함수
	var _szStartDate = '';
	var _szEndDate= '';

	///////////////////////////////////
	// 페이징 오브젝트
	$.paging = {
		/////////////////////////////////////
		// Getter
		getCurrentPageNo: function()
		{
			return _nCurrentPageNo;
		},

		getRowLimit: function()
		{
			return _nLimit;
		},

		getTotalListCnt: function()
		{
			return _nTotalListCnt;
		},

		getTotalPage: function()
		{
			return getTotalPage;
		},

		getBlockCnt: function()
		{
			return _nBlockCnt; 
		},

		getCallback: function()
		{
			return _fnCallBack;	
		},
		
		getStartNo: function()
		{
			if(_nCurrentPageNo>1)
			{
				var nStartNo = ((_nCurrentPageNo-1)*_nLimit);
			}
			else
			{
				var nStartNo = 0;
			}
			return (nStartNo>0)?nStartNo:0;
		},
		
		getEndNo: function()
		{
			var nEndNo = ($.paging.getStartNo()) +_nLimit;
			return (nEndNo<_nTotalListCnt)?nEndNo:_nTotalListCnt;
		},

		//////////////////////////////////////
		// setter
		setPrintDivName: function(szDivName)
		{
			_szPrintDivName = szDivName;
		},

		setCurrentPageNo: function(nCurrentPageNo)
		{
			_nCurrentPageNo = nCurrentPageNo;
		},

		setRowLimit: function(nLimit)
		{
			_nLimit = nLimit;
		},

		setTotalListCnt: function(nTotalListCnt)
		{
			_nTotalListCnt = nTotalListCnt;
		},

		setTotalPage: function(nTotalPage)
		{
			_nTotalPage = nTotalPage;
		},

		setBlockCnt: function(nBlockCnt)
		{
			_nBlockCnt = nBlockCnt;	
		},

		setCallback: function(fnCallBack)
		{
			if(typeof fnCallBack == 'function')
				_fnCallBack= fnCallBack;	
			else
				alert('함수타입의 인자값을 넣어주세요');
		},

		setDate: function(szStartDate, szEndDate)
		{
			_szStartDate = szStartDate;
			_szEndDate = szEndDate;
		},

		///////////////////////////////////////////
		// 페이지 출력 
		print : function()
		{
			var _nTotalPage = parseInt(Math.ceil(_nTotalListCnt / _nLimit), 10);

			//var szFirstBtn  = '<a href="javascript:;" class="pre"><img src="'+ AFREECA +'/images/kfatv/ver2/bul_arw.gif" alt="이전" style="display:none;" border="0" /></a> ' ;
			var szFirstBtn  = '' ;
			//var szEndBtn    = '<a href="javascript:;" class="next"><img src="'+ AFREECA +'/images/kfatv/ver2/bul_arw.gif" alt="다음" style="display:none;" border="0" /></a> ' ;
			var szEndBtn    = '' ;
			var szFirstNum  = '' ;
			var szEndNum    = '' ;
			var szPaging    = '' ;
			var nPreIdx     = '' ;
			var nNextIdx    = '' ;

			var tmp_page_num = parseInt(_nCurrentPageNo / _nBlockCnt, 10)+1;
			var chk = _nCurrentPageNo % _nBlockCnt;
			if(chk==0 && tmp_page_num>1) tmp_page_num = tmp_page_num - 1;

			var nStartPageNo = (( tmp_page_num * _nBlockCnt) - _nBlockCnt) + 1;
			var nEndPageNo = -1;

			// Last Page Block Number
			if(_nTotalPage > (tmp_page_num * _nBlockCnt))
			{
				nEndPageNo = tmp_page_num*_nBlockCnt;
			}
			else
			{
				nEndPageNo = _nTotalPage;
			}

			if(nStartPageNo > _nBlockCnt) nPreIdx = nStartPageNo - 1;
			if(nEndPageNo != _nTotalPage) nNextIdx = nEndPageNo + 1;

			if(nPreIdx)
			{
				szFirstBtn = '<a href="javascript:$.paging.move(' + nPreIdx + ');" class="pre" >' 
							+ '<img src="' + AFREECA + '/images/kfatv/ver2/btn_page_pre.gif" alt"이전" border="0" /></a>';

				szFirstNum = '<font class=pagination><a href="javascript:$.paging.move(1);">&nbsp;&nbsp;1</a></font><span> ... </span>';
			}

			if(nNextIdx)
			{
				szEndBtn = '&nbsp;&nbsp;<a href="javascript:$.paging.move(' + nNextIdx + ');" class="next">' 
							+ '<img src="' + AFREECA + '/images/kfatv/ver2/btn_page_next.gif" alt="다음" border="0" /></a>';

				szEndNum = '<span> ... </span><a href="javascript:$.paging.move('+ _nTotalPage + ');">' + _nTotalPage + '</a>';
			}


			for(var idx = nStartPageNo; idx<=nEndPageNo; idx++)
			{
				if(_nCurrentPageNo == idx)
				{
					if(nStartPageNo == idx)
						szPaging += '<strong class="first">' + idx + '</strong>';
					else
						szPaging += '<strong>' + idx + '</strong>';
				}
				else
				{
					if(nStartPageNo == idx)
						szPaging += '&nbsp;<a href="javascript:$.paging.move(' + idx + ');" class="first">' + idx + '</a>&nbsp';
					else
						szPaging += '&nbsp;<a href="javascript:$.paging.move(' + idx + ');">' + idx + '</a>&nbsp';
				}
			}

			if(!szPaging) szPaging = '<strong class="first"> 1 </strong>';
			//alert(szFirstBtn + szFirstNum + szPaging + szEndNum + szEndBtn);
			$("#"+ _szPrintDivName).html(szFirstBtn + szFirstNum + szPaging + szEndNum + szEndBtn);
		},

		////////////////////////////////////
		//페이지 이동
		move : function(nMovePageNo)
		{
			if(nMovePageNo > _nTotalListCnt)
			{
				_nCurrentPageNo = _nTotalPage;
			}
			else if(nMovePageNo< 1 )
			{
				_nCurrentPageNo = 1;
			}
			else
			{
				_nCurrentPageNo = nMovePageNo;
			}

			$("#"+_szPrintDivName).html('');
			// 페이지 이동 후 실행할 함수(수행할 액션)
			//var fnCallBackFunc= $.paging.getCallback();
			try{
			_fnCallBack('ulList', _szStartDate, _szEndDate, $.paging.getStartNo(), $.paging.getEndNo());
			}catch(e)
			{
				alert(e.description);
			}
		}
	};
})(jQuery)
