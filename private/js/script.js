$(document).ready(function() {
	$('a[href^="http://"]').prop('target', '_blank');
	$('a[href^="https://"]').prop('target', '_blank');
	var _Debug_ = false, $Datas = false;
	function Debug(v, type=false){
		if(_Debug_) {
			switch(type){
				case 'group':
					console.groupCollapsed(v);
					break;
				case 'groupend':
					console.groupEnd();
					break;
				case 'info':
					console.info(v);
					break;
				case 'warning':
					console.warn(v);
					break;
				case 'error':
					console.error(v);
					break;
				case 'time':
					console.time('AJAX Time answer');
					break;
				case 'timeend':
					console.timeEnd(v);
					break;
				default:
					console.log(v);
				break;
			}
		}
	}
	$.unserialize = function(serializedString){
		var str = decodeURIComponent(serializedString.replace(/\+/gmi, ' ')),
		pairs = str.split('&'),
		obj = {}, p, idx;
		for (var i=0, n=pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];
			if (obj[idx] === undefined) {
				obj[idx] = unescape(p[1]);
			}else{
				if (typeof obj[idx] == "string") {
					obj[idx]=[obj[idx]];
				}
				obj[idx].push(unescape(p[1]));
			}
		}
		return obj;
	};
	if(window.location.hash) {
		$Datas = $.unserialize(window.location.hash.substr(1));
		if($Datas['debug']) {
			_Debug_ = true;
			Debug('Debug mode detected', 'log');
		}
		Debug([$Datas], 'info');
	}
	if(window.location != window.parent.location) {
		Debug('Iframe detected, add class iFrame to HTML', 'log');
			$('html').addClass('iframe');
	}
	var $Body = $('body'),
	$Title = $('title'),
	$Reset = $('#Reset'),
	$HomeLink = $('h1>a'),
	$QuickSearchLink = $('h1>span>a'),
	$QuickSearchBOX = $('#quicksearch'),
	$Line = $('.linesearch'),
	$Form = $('form'),
	Channels         = $('#Channels'),
	Preferences         = $('#Preferences'),
	MaxChannels		= $('#MaxChannels'),
	countermaxchannel		= $('#countermaxchannel'),
    PlusButton      = $('#bp'),
	LessButton      = $('#bl'),
	PlusPlusButton  = $('#bpp'),
	LessLessButton  = $('#bll'),
	Count      = $('#count'),
	DropDownDefault = [{id:'any',text:'Any'},{id:'intensity',text:'Intensity'},{id:'strobe',text:'Strobe'},{id:'shutter',text:'Shutter'},{id:'pan',text:'Pan'},{id:'pan fine',text:'Pan Fine'},{id:'tilt',text:'Tilt'},{id:'pt speed',text:'PT Speed'},{id:'color',text:'Color'},{id:'color macro',text:'Color Macro'},{id:'red',text:'Red'},{id:'green',text:'Green'},{id:'blue',text:'Blue'},{id:'white',text:'White'},{id:'amber',text:'Amber'},{id:'uv',text:'UV'},{id:'cyan',text:'Cyan'},{id:'magenta',text:'Magenta'},{id:'yellow',text:'Yellow'},{id:'ctc',text:'CTC'},{id:'cto',text:'CTO'},{id:'gobo',text:'Gobo'},{id:'gobo rot',text:'Gobo Rot'},{id:'zoom',text:'Zoom'},{id:'iris',text:'Iris'},{id:'macro',text:'Macro'},{id:'chase',text:'Chase'},{id:'fx',text:'FX'},{id:'ctrl',text:'Ctrl'},{id:'anim ',text:'Anim '},{id:'audio',text:'Audio'},{id:'aux',text:'Aux'},{id:'av fader',text:'Av Fader'},{id:'beatbridge',text:'Beatbridge'},{id:'brightness',text:'Brightness'},{id:'camera x',text:'Camera X'},{id:'chase ',text:'Chase '},{id:'chase spd',text:'Chase Spd'},{id:'chase speed',text:'Chase Speed'},{id:'cmy',text:'Cmy'},{id:'cold',text:'Cold'},{id:'color ',text:'Color '},{id:'color chase',text:'Color Chase'},{id:'color fnc',text:'Color Fnc'},{id:'color mode',text:'Color Mode'},{id:'color speed',text:'Color Speed'},{id:'color x',text:'Color X'},{id:'cool',text:'Cool'}],
	DropDown = DropDownDefault,
	DropDownFull = [{id:'any',text:'Any'},{id:'amber',text:'Amber'},{id:'anim 1',text:'Anim 1'},{id:'audio',text:'Audio'},{id:'aux1',text:'Aux1'},{id:'av fader',text:'AV Fader'},{id:'beatbridge',text:'BeatBridge'},{id:'blue',text:'Blue'},{id:'brightness',text:'Brightness'},{id:'camera x',text:'Camera X'},{id:'chase',text:'Chase'},{id:'chase 1',text:'Chase 1'},{id:'chase spd',text:'Chase Spd'},{id:'chase speed',text:'Chase Speed'},{id:'cmy',text:'CMY'},{id:'cold',text:'Cold'},{id:'color',text:'Color'},{id:'color 1',text:'Color 1'},{id:'color 2',text:'Color 2'},{id:'color chase',text:'Color Chase'},{id:'color fnc',text:'Color Fnc'},{id:'color macro',text:'Color Macro'},{id:'color mode',text:'Color Mode'},{id:'color speed',text:'Color Speed'},{id:'color x',text:'Color X'},{id:'cool',text:'Cool'},{id:'cool white',text:'Cool White'},{id:'ctc',text:'CTC'},{id:'cto',text:'CTO'},{id:'ctrl',text:'Ctrl'},{id:'ctrl fnc',text:'Ctrl Fnc'},{id:'cue',text:'Cue'},{id:'cue a',text:'Cue A'},{id:'cue a1',text:'Cue A1'},{id:'cue ab',text:'Cue AB'},{id:'cue page',text:'Cue Page'},{id:'cuelist',text:'Cuelist'},{id:'cyan',text:'Cyan'},{id:'dimmer',text:'Dimmer'},{id:'direction',text:'Direction'},{id:'effect',text:'Effect'},{id:'effects',text:'Effects'},{id:'effects fnc',text:'Effects Fnc'},{id:'fan',text:'Fan'},{id:'flash intensity',text:'Flash Intensity'},{id:'flow',text:'Flow'},{id:'fnc',text:'Fnc'},{id:'fog',text:'Fog'},{id:'fog 1',text:'Fog 1'},{id:'fog ctrl',text:'Fog Ctrl'},{id:'fog fnc',text:'Fog Fnc'},{id:'folder',text:'Folder'},{id:'fountain',text:'Fountain'},{id:'frame blending',text:'Frame Blending'},{id:'front film',text:'Front Film'},{id:'fx',text:'FX'},{id:'fx ctrl',text:'FX Ctrl'},{id:'fx grouping',text:'FX Grouping'},{id:'fx level',text:'FX Level'},{id:'fx1',text:'FX1'},{id:'gobo',text:'Gobo'},{id:'gobo 1',text:'Gobo 1'},{id:'gobo 1 rot',text:'Gobo 1 Rot'},{id:'gobo rot',text:'Gobo Rot'},{id:'green',text:'Green'},{id:'green laser',text:'Green Laser'},{id:'group',text:'Group'},{id:'haze',text:'Haze'},{id:'hue',text:'Hue'},{id:'index',text:'Index'},{id:'intensity',text:'Intensity'},{id:'iris',text:'Iris'},{id:'kstn 1x',text:'Kstn 1x'},{id:'kstn l',text:'Kstn L'},{id:'kstn mode',text:'Kstn Mode'},{id:'lamp',text:'Lamp'},{id:'laser',text:'Laser'},{id:'level',text:'Level'},{id:'library',text:'Library'},{id:'lift',text:'Lift'},{id:'look',text:'Look'},{id:'macro',text:'Macro'},{id:'magenta',text:'Magenta'},{id:'mask',text:'Mask'},{id:'merging',text:'Merging'},{id:'mirror rot',text:'Mirror Rot'},{id:'mirror swivel',text:'Mirror Swivel'},{id:'mix 1',text:'Mix 1'},{id:'mix level',text:'Mix Level'},{id:'mode',text:'Mode'},{id:'motor speed',text:'Motor Speed'},{id:'movement',text:'Movement'},{id:'mspeed',text:'MSpeed'},{id:'opacity',text:'Opacity'},{id:'output a/b',text:'Output A/B'},{id:'pan',text:'Pan'},{id:'pan 1',text:'Pan 1'},{id:'pan 1+4',text:'Pan 1+4'},{id:'pan fine',text:'Pan Fine'},{id:'pan speed',text:'Pan Speed'},{id:'pattern',text:'Pattern'},{id:'pb button page',text:'Pb Button Page'},{id:'perspective',text:'Perspective'},{id:'pixmap level',text:'PixMap Level'},{id:'play mode',text:'Play Mode'},{id:'player ctrl',text:'Player Ctrl'},{id:'pos',text:'Pos'},{id:'preset',text:'Preset'},{id:'profile',text:'Profile'},{id:'programs',text:'Programs'},{id:'pt macro',text:'PT Macro'},{id:'pt speed',text:'PT Speed'},{id:'rainbow',text:'Rainbow'},{id:'red',text:'Red'},{id:'refl rot',text:'Refl Rot'},{id:'render',text:'Render'},{id:'rot',text:'Rot'},{id:'rotate',text:'Rotate'},{id:'rsrvd',text:'Rsrvd'},{id:'rsrvd 1',text:'Rsrvd 1'},{id:'sat',text:'Sat'},{id:'screen ctrl',text:'Screen Ctrl'},{id:'scroll',text:'Scroll'},{id:'scroller 1',text:'Scroller 1'},{id:'shape',text:'Shape'},{id:'shutter',text:'Shutter'},{id:'signal',text:'Signal'},{id:'single',text:'Single'},{id:'slide group',text:'Slide Group'},{id:'source',text:'Source'},{id:'strobe',text:'Strobe'},{id:'strobe 1',text:'Strobe 1'},{id:'strobe fnc',text:'Strobe Fnc'},{id:'tc hour',text:'TC Hour'},{id:'tilt',text:'Tilt'},{id:'tilt 1',text:'Tilt 1'},{id:'timeline',text:'Timeline'},{id:'trigger',text:'Trigger'},{id:'uv',text:'UV'},{id:'uv 1',text:'UV 1'},{id:'video in',text:'Video IN'},{id:'view',text:'View'},{id:'volume',text:'Volume'},{id:'warm',text:'Warm'},{id:'warm 1',text:'Warm 1'},{id:'warm white',text:'Warm White'},{id:'white',text:'White'},{id:'white 1',text:'White 1'},{id:'x',text:'X'},{id:'x pos',text:'X Pos'},{id:'x rot',text:'X Rot'},{id:'x size',text:'X Size'},{id:'x-pos',text:'X-Pos'},{id:'xfade',text:'XFade'},{id:'y pos',text:'Y Pos'},{id:'y rot',text:'Y Rot'},{id:'y speed',text:'Y Speed'},{id:'y-pos',text:'Y-Pos'},{id:'y-pos 1',text:'Y-Pos 1'},{id:'y-pos 2',text:'Y-Pos 2'},{id:'yellow',text:'Yellow'},{id:'zoom',text:'Zoom'}],
	x = 1,
	y = 0,
	RegexWheel = /^(color|gobo|animation) ?([0-9]{1,2})?$/i,
	Wheel = {
		'color' 	: 0,
		'gobo'		: 0,
		'animation'	: 0
	},
	timer,
	timer2,
	ActualLink = window.location.pathname,
	DefaultSelect2 = 'span[id^="select2-SPB8-"]',
	DefaultSelect = '<div id="chSPB8">'+
	"\t"+'<div class="label">#SPB8<span>Channel type</span></div>'+
	"\t\t"+'<div><select data-default="any" autocomplete="off" name="chSPB8">'+
	"\t\t"+'</select></div>'+
	"\t"+'</div>';
	$Body.append('<div id="NavButtons"><a class="img" href="#ToTop" title="Go to top">▲</a><a class="img" href="#ToBottom" title="Go to bottom">▼</a></div>');
	$.Wait = function(ms) {
		var defer = $.Deferred();
		setTimeout(function() {
			defer.resolve();
		}, ms);
		return defer;
	};
	$.fn.WheelCount = function(wait=0) {
		Debug('Function Wheelount(wait, count)', 'group');
		count = this.val();
		if(count == 0) {
			count = 'Any';
		}
		Debug([wait, count], 'warn');
			this.val(TwoDigit(count)).addClass('active');
			clearTimeout(timer);
		Debug('Timer cleared', 'info');
			timer = setTimeout(function (event) {
				Debug('Function WheelCount(wait, count) Timer raised with '+wait, 'info');
				TrigChange();
				Debug('', 'groupend');
			}, wait);
		return this;
	};
	$.fn.DMXCount = function(wait, count) {
		Debug('Function DMXCount(wait, count)', 'group');
		Debug([wait, count], 'warn');
			this.val(TriDigit(count)).addClass('active');
			clearTimeout(timer);
		Debug('Timer cleared', 'info');
			timer = setTimeout(function (event) {
				Debug('Function DMXCount(wait, count) Timer raised with '+wait, 'info');
				TrigChange();
				Debug('', 'groupend');
			}, wait);
		return this;
	};
	$.fn.AddSelect = function(ChRef) {
		Debug('Function AddSelect(ChRef)', 'group');
		Debug([ChRef], 'warn');
			var Html = DefaultSelect.replace(/SPB8/gm, ChRef);
			Debug('Add new Select channel type', 'info');
				this.append(Html);
			Debug('Add autocomplete to this new Select', 'info');
				$('select[name="ch'+ChRef+'"]').select2({data: DropDown});
		Debug('', 'groupend');
	  return this;
	};
	$.fn.RemoveSelect = function(ChRef) {
		Debug('Function RemoveSelect(ChRef)', 'group');
		Debug([ChRef], 'warn');
		var ToBeUnloaded = this.find('select[name="ch'+ChRef+'"]');
			Debug('Unload Autocomplete from select to be removed', 'info');
				ToBeUnloaded.select2('destroy');
			Debug('Remove row containing select', 'info');
				$('#ch'+ChRef).remove();
		Debug('', 'groupend');
	  return this;
	};
	$.fn.CheckValueSelect = function() {
		Debug('Function CheckValueSelect()', 'group');
			var $this = this;
			if(!!$this.val()) {
				var $Val = $this.val().toLowerCase(),
				$Name = $this.prop('name'),
				$Text = $this.find('option:selected').text(),
				$Default = $this.attr('data-default').toLowerCase(),
				NewSelector = DefaultSelect2.replace(/SPB8/gm, $Name),
				ColorToChange = $(NewSelector).parent('span'),
				$DivParent = $this.parent('div');
				Debug([$Text, $Name, NewSelector, ColorToChange], 'info');
				if($Val != $Default){
					Debug('ADD Background', 'info');
					ColorToChange.addClass('otherthanany').attr('data-background', $Text.toLowerCase());
				} else {
					Debug('REMOVE Background', 'info');
					ColorToChange.removeClass('otherthanany');
				}
				if($DivParent.hasClass('TwoColumns') && !$this.hasClass('BlockButton')) {
					Debug('Wheel Field removed', 'info');
					$DivParent.removeClass('TwoColumns');
					$DivParent.find('.BlockButton').remove();
				}
				if(RegexWheel.test($Val)) {
					Debug('Wheel Field added', 'group');
						var WheelInfo = $Val.match(RegexWheel);
						if(!WheelInfo[2]) {
							WheelInfo[2] = 1;
						}
						Debug('Wheel '+WheelInfo[1]+' n°'+WheelInfo[2], 'info');
						$DivParent.find('.BlockButton').remove();
						$DivParent.addClass('TwoColumns').append('<input type="text" class="BlockButton" name="'+WheelInfo[1]+'slots'+(WheelInfo[2])+'" data-default="Any" value="Any"/>');
					Debug('', 'groupend');
				}
			}
		Debug('', 'groupend');
	  return this;
	};
	function BlurAll() {
		Debug('Function BlurAll()', 'group');
			Debug('Add CSS class LOADER to Body', 'infos');
				$Body.addClass('loader');
			//$Form.addClass('focus');
			Debug('Set all input, select and button readonly attribute. Then set focus out', 'infos');
				$Form.find('input, select, button').prop('readonly', true).blur();
		Debug('', 'groupend');
	}
	function UnBlurAll() {
		Debug('Function UnBlurAll()', 'group');
			Debug('Remove CSS class LOADER from Body', 'infos');
				$Body.removeClass('loader');
			//$Form.removeClass('focus');
			Debug('Remove readonly attributes from all input, select and button readonly', 'infos');
				$Form.find('input, select, button').prop('readonly', false);
		Debug('', 'groupend');
		}
	function TrigChange() {
		Debug('Function TrigChange()', 'group');
			BlurAll();
			Debug('Remove class Active from DMX n° of Channel', 'info');
				Count.removeClass('active');
			Debug('Remove class Active from MAX DMX Channel', 'info');
				MaxChannels.removeClass('active');
			Debug('Remove class Active from Wheel Channel', 'info');
				$Body.find('.BlockButton').removeClass('active');
			Debug('Trigger CHANGE to select', 'infos');
				$(Channels).find('select').eq(0).trigger('change');
		Debug('', 'groupend');
		}
	function TriDigit(val) {
		Debug('Function TriDigit(val)', 'group');
		Debug([val], 'warn');
			var v = val;
			while((v+'').length < 3) {
				Debug('Add a 0 to number '+val, 'info');
				v = '0'+v;
				}
			Debug('Return '+val+' > '+v, 'info');
		Debug('', 'groupend');
		return v;
		}
	function TwoDigit(val) {
		Debug('Function TwoDigit(val)', 'group');
		Debug([val], 'warn');
			var v = val;
			if(v != 'Any') {
				while((v+'').length < 2) {
					Debug('Add a 0 to number '+val, 'info');
					v = '0'+v;
					}
				Debug('Return '+val+' > '+v, 'info');
			}
		Debug('', 'groupend');
		return v;
		}
	function DirectDMX() {
		Debug('Function DirectDMX()', 'group');
			BlurAll();
			var DMXChannelVal = parseInt(Count.val().trim());
			Debug(['DMX n° of Channel, Filtered Value', Count.val(), DMXChannelVal], 'info');
			if(DMXChannelVal == 0) {
				Debug('Requested DMX n° of Channel is 0, reset the first select to Any and set DMX n° of Channel to 1', 'info');
				$('select[name="ch1"]').val('any').trigger('change.select2');
				DMXChannelVal = 1;
			}
			if(DMXChannelVal > 0 && DMXChannelVal <= 512) {
				Debug('Requested 512 < DMX n° of Channel > 0', 'info');
				if(x > DMXChannelVal) {
					Debug('Previous DMX n° of Channel count > entered value', 'info');
					for(var i=DMXChannelVal+1; i<=x; i++) {
						Channels.RemoveSelect(i);
					}
				}
				if(DMXChannelVal > x) {
					Debug('Entered value > DMX n° of Channel count ', 'info');
					for(var i=x+1; i<=DMXChannelVal; i++) {
						Channels.AddSelect(i);
					}
				}
				Debug('Set DMX n° of Channel count to '+x, 'info');
				x = DMXChannelVal;
				}
			Count.DMXCount(50, x);
		Debug('', 'groupend');
		}
	function DirectDMX2() {
		Debug('Function DirectDMX2()', 'group');
			BlurAll();
			var DMXChannelVal = parseInt(MaxChannels.val().trim());
			Debug(['MAX DMX, Filtered Value', MaxChannels.val(), DMXChannelVal], 'info');
			if(DMXChannelVal >= 0 && DMXChannelVal <= 512) {
				Debug('Requested 512 <= DMX n° of Channel >= 0', 'info');
					y = DMXChannelVal;
				Debug('Set MAX DMX count to '+y, 'info');
				}
			MaxChannels.DMXCount(50, y);
		Debug('', 'groupend');
		}
	function ChangeDropDown(DropDown) {
		BlurAll();
		$Datas = $.unserialize($('form').serialize());
		Channels.find('select[name^="ch"]').empty().select2({data: DropDown});
		HashUsed(true);
		UnBlurAll();
	}
	function QuickAction() {
		if($Datas) {
			var NbChannelToAdd = Object.keys($Datas).length - 1,
			NbActualChannel = Number(Count.val());
			if(NbChannelToAdd > 0) {
				if($('select[name="ch'+NbActualChannel+'"]').val() == 'any') {
					NbActualChannel = NbActualChannel -1;
				}
				Count.val(NbActualChannel + NbChannelToAdd).trigger('change');
				$.each($Datas, function(index, value){
					index = Number(index);
					if(Number.isInteger(index)) {
						value = value.toLowerCase();
						$('select[name="ch'+(NbActualChannel + index)+'"]').val(value).trigger('change.select2').CheckValueSelect();
					}

				});
			}
		$Datas = false;
		}
	}
	function HashUsed(direct) {
		if($Datas) {
			$.each($Datas, function(index, value){
				value = value.toLowerCase();
				if(index.toLowerCase() != 'debug') {
					switch(index.toLowerCase()) {
						case 'maxchannels':
							$('*[name="'+index+'"]').val(value);
							Debug('Only change value', 'info');
							break;
						case 'searchmode':
						case 'count':
						case 'fullparam':
							if(!direct) {
								$('*[name="'+index+'"]').val(value).trigger('change');
								Debug('Trigger real change', 'info');
							} else {
								$('*[name="'+index+'"]').val(value).trigger('change.select2');
							}
							break;
						default:
							$('*[name="'+index+'"]').val(value).trigger('change.select2').CheckValueSelect();
							Debug('Trigger false change for autocomplete & Activate Highlight selection', 'info');
							break;
					}
					Debug([index, value], 'warn');
				} else if(index.toLowerCase() == 'debug') {
					$('form').append('<input type="hidden" name="debug" value="debug" />');
				}
			});
			TrigChange();
			if(!$Datas['debug']) {
				window.history.pushState(null, document.title, window.location.pathname);
			}
		$Datas = false;
		}
	}
	Debug('Initialisation', 'group');
		Debug('Fancybox for Pop-in', 'info');
			$('body').on('click', 'a[pop]', function(e) {
				e.preventDefault();
				var Link = $(this).attr('href'),
				Title = $(this).text(),
				OriginTitle = document.title;
				$.fancybox.open({
					opts: {
						smallBtn : true,
						touch: false,
						buttons : [],
						ajax : {
							settings : {
								method: 'POST',
								data : {
									GetPage : true,
									fancybox : false
								}
							}

						},
						afterLoad: function(i,c) {
							$Title.text(Title);
							history.pushState({url : Link, title : Title}, Title, Link);
						},
						beforeClose: function(i,c) {
							$Title.text(OriginTitle);
							history.back();
						}
					},
					src  : Link,
					type : 'ajax'
				});
			});
			$('body').on('click', 'a[pop-iframe]', function(e) {
				e.preventDefault();
				$.fancybox.open({
					smallBtn : true,
					touch: false,
					buttons : [],
					src  : $(this).attr('href'),
					type : 'iframe'
				});
			});
		Debug('Select2 for autocomplete SELECT', 'info');
			$.fn.select2.defaults.set('width', '80%');
		Debug('Add the first select to the page', 'info');
			Channels.AddSelect(1);
		Debug('Hide the MAX Channel row', 'info');
			countermaxchannel.hide();
		Debug('Add AutoComplete to Preferences without search', 'info');
			Preferences.find('select').select2({minimumResultsForSearch: Infinity});
		Debug('Add AutoComplete to Channels with reduced search', 'info');
			Channels.find('select[name^="ch"]').select2({data: DropDown});
			Channels.find('select[name="Manufacturer"]').select2();
			Channels.find('select[name="FixtureName"]').select2();
	Debug('', 'groupend');
	 // Create reusable method
    function myConfirm( opts ) {
        $.fancybox.open(
             '<div class="form dialog">' +
                    '<h2>' + opts.title + '</h2>' +
                    '<p>' + opts.message + '</p>' +
                    '<p>' +
                        '<a data-value="0" data-fancybox-close>Cancel</a> ' +
                        '<button data-value="1" data-fancybox-close class="btn">Yes</button>' +
                    '</p>' +
             '</div>', {
                 smallBtn   : false,
                 buttons    : false,
                 keyboard   : false,
                 afterClose : function( instance, current, e ) {
                     var button = e ? e.target || e.currentTarget : null,
                     value  = button ? $(button).data('value') : 0;

                     opts.callback(value);
                 }
             }
        );
    }
	if(window.location.pathname == '/') {
		$HomeLink.click(function(e) {
			e.preventDefault();
			var URI = $(this).attr('href');
			myConfirm({
				title    : 'Are you sure?',
				message  : 'Do you want to loose your search and refresh this page?',
				callback : function (value) {
					if (value) {
					   window.location = URI;
					} else {
						return false;
					}
				}
			});
		});
	}
	//DMX Input down
    $(PlusButton).click(function(e){
		Debug('CLICK + button of DMX Channel n°', 'group');
			e.preventDefault();
			if(x <= 512){
				x++;
				Channels.AddSelect(x);
				Count.DMXCount(700, x);
			}
		Debug('', 'groupend');
    });
	$(PlusPlusButton).click(function(e){
		Debug('CLICK + button of Max DMX', 'group');
			e.preventDefault();
			if(y <= 512){
				y++;
				MaxChannels.DMXCount(700, y);
			}
		Debug('', 'groupend');
    });
	//DMX Input up
	$(LessButton).click(function(e){
		Debug('CLICK - button of DMX Channel n°', 'group');
			e.preventDefault();
			if(x > 1){
				Channels.RemoveSelect(x);
				x--;
				Count.DMXCount(700, x);
			}
    });
	$(LessLessButton).click(function(e){
		Debug('CLICK  - button of Max DMX', 'group');
			e.preventDefault();
			if(y > 0){
				y--;
				MaxChannels.DMXCount(700, y);
			}
		Debug('', 'groupend');
    });
	$Reset.click(function(e){
		Debug('RESET Channel type to default', 'group');
			e.preventDefault();
			$(Channels).find('select').each(function() {
				$(this).val('any').trigger('change.select2').CheckValueSelect();
			});
			Wheel = {
				'color' 	: 0,
				'gobo'		: 0,
				'animation'	: 0
			};
			TrigChange();
		Debug('', 'groupend');
	});
    Count.click(function(){
		Debug('CLICK DMX Channel n°', 'group');
			Debug('Select the complete input value', 'info');
			$(this).select();
		Debug('', 'groupend');
	});
	//Display the fixture changelog
	$Body.on('click', 'a[href="#ChangelogLink"]', function(e){
		Debug('Changelog Link Clicked', 'group');
			e.preventDefault();
			var $DisplayChangelog = $('#ChangelogLink');
			if($DisplayChangelog.is(':visible')) {
				$DisplayChangelog.slideUp(250);
			} else {
				$DisplayChangelog.slideDown(250);
			}
		Debug('', 'groupend');
	});
	//Display QuickSearch box
	$QuickSearchLink.addClass('HighLight');
	$QuickSearchBOX.slideDown(250);
		$.Wait(250).then(function() {
			$QuickSearchLink.removeClass('HighLight');
			$QuickSearchBOX.slideUp(250);
		});
	$QuickSearchLink.click(function(e){
		Debug('QuickSearch Panel Displayed', 'group');
			e.preventDefault();
			if($QuickSearchBOX.is(':visible')) {
				$QuickSearchBOX.slideUp(250);
				$QuickSearchLink.removeClass('HighLight');
			} else {
				ScrollToTop();
				$QuickSearchBOX.slideDown(250);
				$QuickSearchLink.addClass('HighLight');
			}
		Debug('', 'groupend');
	});

	//Scroll Shortcut
	$(window).scroll(function() {
		if($(this).scrollTop() > 50) {
			$('#NavButtons').fadeIn(250);
		} else {
			$('#NavButtons').fadeOut(250);
		}
	});
	$('#NavButtons').on('click', 'a', function(e) {
		e.preventDefault();
		var $Href = $(this).attr('href');
		if($Href == '#ToTop') {
			ScrollToTop();
		} else {
			ScrollToBottom();
		}
	});
	function ScrollToTop() {
		$('html, body').animate({scrollTop: 0}, 250);
	}
	function ScrollToBottom() {
		$('html, body').animate({scrollTop: document.body.scrollHeight}, 250);
	}
	//QuickSearch Link hit
	$QuickSearchBOX.find('a').click(function(e){
		Debug('QuickSearch link clicked', 'group');
			e.preventDefault();
			$QuickSearchLink.removeClass('HighLight');
			$QuickSearchBOX.slideUp(250);
			var $Href = $(this).attr('href').substr(1);
			$Datas = $.unserialize($Href);
			switch($Href.substring(0,6).toLowerCase()) {
				case 'action':
					console.log($Datas);
					QuickAction();
					break;
				default:
					$Datas = $.unserialize($(this).attr('href').substr(1));
					HashUsed(false);
					break;
			}
		Debug('', 'groupend');
	});
	MaxChannels.click(function(){
		Debug('CLICK Max DMX', 'group');
			Debug('Select the complete input value', 'info');
			$(this).select();
		Debug('', 'groupend');
	});
	$Body.on('click', '.BlockButton', function(){
		Debug('CLICK Wheel number', 'group');
			Debug('Select the complete input value', 'info');
			$(this).select();
		Debug('', 'groupend');
	});
	$Body.on('change', '.BlockButton', function(){
		Debug('Change Wheel number', 'group');
			$(this).WheelCount();
		Debug('', 'groupend');
	});
	//Detect change on the number of DMX input
	Count.on('change', function() {
		Debug('CHANGE of DMX Channel n°', 'group');
			DirectDMX();
		Debug('', 'groupend');
	});
	MaxChannels.on('change', function() {
		Debug('CHANGE of Max DMX', 'group');
			DirectDMX2();
		Debug('', 'groupend');
	});
	//Detect Preferences changed
	$(Preferences).on('change','select', function() {
		Debug('CHANGE of Preference', 'group');
			var $This = $(this),
			CheckValue = $This.val();
			$This.CheckValueSelect();
			if($This.prop('id') == 'SearchMode') {
				Debug('CHANGE of Search Mode', 'info');
				Debug([CheckValue], 'warn');
				if(CheckValue == 'exact' || CheckValue == 'live exact') {
					Debug('HIDE Max DMX', 'info');
					countermaxchannel.slideUp(250);
				} else {
					Debug('SHOW Max DMX', 'info');
					countermaxchannel.slideDown(250);
				}
			}
			if($This.prop('id') == 'FullParam') {
				Debug('CHANGE of Channel Type List', 'info');
				if(CheckValue == 0) {
					Debug('Set AutoComplete list to Restricted choice', 'info');
					if(DropDown != DropDownDefault) {
						DropDown = DropDownDefault;
						ChangeDropDown(DropDownDefault);
					}
				} else {
					Debug('Set AutoComplete list to Full choice', 'info');
					if(DropDown != DropDownFull) {
						DropDown = DropDownFull;
						ChangeDropDown(DropDownFull);
					}
				}
			} else {
				TrigChange();
			}
		Debug('', 'groupend');
	});
	//Detect Channel changed
	$(Channels).on('change','select', function(data){
		Debug('SEARCH for FIXTURES Matching New settings', 'group');
			$(this).CheckValueSelect();
			BlurAll();
			if($(this).prop('id') == 'FixtureName') {
				Debug('CHANGE of Fixture Name', 'info');
				if($(this).val() != 'Any' && $('#SearchMode').val() == 'exact') {
					$('#SearchMode').val('live').trigger('change');
				} else {
					$('#SearchMode').trigger('change');
				}
			} else {
				var Line = '',
				Search = $('#SearchMode option:selected').text(),
				Manuf = $('#Manufacturer option:selected').text(),
				FixtureName = $('#FixtureName option:selected').text(),
				MDMX = MaxChannels.val(),
				NDMX = $('#count').val(),
				FormData = $('form').serialize();
				Debug('Run the search', 'info');
				Debug([FormData], 'warn');
				Debug('AJAX Time answer', 'time');
				clearTimeout(timer2);
				Debug('Timer cleared', 'info');
				timer2 = setTimeout(function (event) {
					Debug('Function SEARCH for FIXTURES Matching New settings Timer raised with 50ms', 'info');
					$.post('request', FormData, function(data) {
						var Sentence = data.NumberOfFixtures+' fixture'+((data.NumberOfFixtures>1) ? 's' : '')+' profile found';
						$(Fixtures).html('<h2>'+Sentence+'</h2>'+data.FixtureHtml);
						Debug('AJAX Time answer', 'timeend');
						Debug('AJAX answer receive => SET and DEFINE Search feedback text', 'info');
						Debug([data], 'info');
						Debug('DEFINE Search feedback text', 'info');
						Line+= '<span><em>'+Search+'</em> search</span>';
						if(Manuf != 'Any' && FixtureName == 'Any') {
							Line+= ' <span>in <em>'+Manuf+'</em>\'s fixtures</span>';
						} else if(Manuf == 'Any' && FixtureName != 'Any') {
							Line+= ' <span>in <em>'+FixtureName+'</em></span>';
						} else if(Manuf != 'Any' && FixtureName != 'Any') {
							Line+= ' <span>in <em>'+Manuf+'</em>\'s '+FixtureName+'</span>';
						} else {
							Line+= ' <span>in <em>all fixtures</em></span>';
						}
						if(Search == 'Exact' || Search == 'Live Exact') {
							Line+= ' <span>with <em>'+NDMX+'</em> Channels</span>';
						} else if(MDMX > 0) {
							Line+= ' <span>with a maximum of <em>'+MDMX+'</em> Channels</span>';
						}
						var LineInText = $(Line).text() + ' (='+data.NumberOfFixtures+')';
						$Title.text(LineInText);
						ActualLink = '#'+$('form').serialize();
						history.pushState({url : ActualLink, title : LineInText}, LineInText, ActualLink);
						$Line.empty().append('<a href="'+ActualLink+'">'+Line+'</a> <span title="'+Sentence+'"><em>(='+data.NumberOfFixtures+')</em></span>');
						UnBlurAll();
						Debug('', 'groupend');
					});
				}, 50);
			}
		return false;
	});

	window.onpopstate = function(e) {
		if(e.state == null) {
			$.fancybox.close();
		} else {
			$.fancybox.close();
			if($('div.fancybox-container').length == 2) {
				window.history.pushState({url : e.state.url, title : e.state.title}, e.state.title, e.state.url);
			} else {
				window.history.pushState(null, window.location.title, ActualLink);
			}
		}
	};

	if(window.location.hash) {
		Debug('RESTORE Previous session', 'group');
		HashUsed(false);
		Debug('', 'groupend');
	}

});
