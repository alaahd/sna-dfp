/* ------------------------------------------------------------------------
	Class: prettyPhoto
	Use: Lightbox clone for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 3.1.3
------------------------------------------------------------------------- */

(function($) {
	$.prettyPhoto = {
		version : '3.1.3'
	};
	$.fn.prettyPhoto = function(pp_settings) {
		pp_settings = jQuery
				.extend(
						{
							animation_speed : 'fast',
							slideshow : 10,
							autoplay_slideshow : false,
							opacity : 0.80,
							show_title : true,
							allow_resize : true,
							default_width : 500,
							default_height : 344,
							counter_separator_label : '/',
							theme : 'pp_default',
							horizontal_padding : 2,
							hideflash : true,
							wmode : 'opaque',
							autoplay : false,
							modal : false,
							deeplinking : false,
							overlay_gallery : true,
							keyboard_shortcuts : true,
							changepicturecallback : function() {
								if(disqus_alreadyInitialized == false){
									initiate_disqus();
									disqus_alreadyInitialized = true;
								}else{
									reload_disqus();
								}
								//adding the SiteCatalyst tracking code								
								var s = s_gi(s_account),
									img_caption = $pp_pic_holder.find('.ppt').text(),
									img_url = $pp_pic_holder.find("#pp_full_res img").attr("src");
								
				                //s.linkTrackVars = 'eVar20,prop23,prop24,prop20,prop3,prop21,prop37,prop38';    

				                s.prop23 = "Skynews Arabia"; //site name
				                s.prop24 = "web";
				                s.prop20 = s.eVar20 = 'image'; //content type
				                
				                s.prop3 = img_caption; //content title
				                s.prop21 = img_url; //content ID
				                s.prop37 = $('#lightboxGallery').data('gallery-id') + '-' + $('#lightboxGallery').data('gallery-title');
				                s.prop38 = img_url + '-' + img_caption;
				                s.prop57 = $('#lightboxGallery').data('gallery-hours');
				                s.prop58 = $('#lightboxGallery').data('gallery-days');
				                s.t(); //Custom Link Report Name
				                
							},
							callback : function() {
								
							},
							ie6_fallback : true,
							markup :
								
								'<div class="pp_pic_holder"> \
								  <div class="ppt" ></div> \
      <div class="pp_top"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
      <div class="pp_content_container"> \
       <div class="pp_left"> \
       <div class="pp_right"> \
        <div class="pp_content"> \
								         <div class="pp_loaderIcon"></div> \
         <div class="pp_fade"> \
          <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
          <div class="pp_hoverContainer"> \
							     <p class="currentTextHolder" style="display:none;">0/0</p> \
								  <a class="pp_close" style="float:right;margin-top:10px;" href="#"></a> \
	<div style="float:right;margin-top:230px;" id="pdiv"> \
	<span id="pImage" style="padding:10px;float:left;margin-top:0px;display:block;"></span>\
	<a class="pp_previous" href="#" > \
	<img style="padding:20px;float:right;display:none;margin-right:20px;" id="next-light" width="0" height="0" border="0"></a>\
								</div>\
<div style="float:left;margin-top:230px;" id="ndiv">\
				<a class="pp_next" href="#">\
								<img style="padding:20px;float:left;display:none;margin-left:20px;" id="prev-light"  width="0" height="0" border="0"></a>\
								<div id="nImage"></div>\
								</div> \
			           </div> \
          <div id="pp_full_res"></div><div class="pp_details" style="display:none;"> \
                                <p class="pp_description"></p> \
		                         </div>  \
                </div>\
        </div> \
       </div> \
       </div> \
      </div> \
      <div class="pp_bottom"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
     </div> \
     <div class="pp_overlay"></div>',
							
     
     gallery_markup : '<div id="pp_comments"><div id="pp_comments_inner"><div id="disqus_thread_wrapper" > \
    	 <div id="disqus_thread"></div></div></div></div><div class="pp_gallery"> \
        <a href="#" class="pp_arrow_previous">Previous</a>\
        <div> \
         <ul id="sthumbs"> \
          {gallery} \
         </ul> \
        </div> \
        <a href="#" class="pp_arrow_next">Next</a> \
       </div>',
							image_markup : '<img id="fullResImage" src="{path}" />'
													}, pp_settings);
		var matchedObjects = this, percentBased = false, pp_dimensions, pp_open, pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth, windowHeight = $(
				window).height(), windowWidth = $(window).width(), pp_slideshow;
		
		
	    
		doresize = true, scroll_pos = _get_scroll();
		$(window).unbind('resize.prettyphoto').bind('resize.prettyphoto',
				function() {
					_center_overlay();
					_resize_overlay();
				});
		if (pp_settings.keyboard_shortcuts) {
			$(document).unbind('keydown.prettyphoto').bind(
					'keydown.prettyphoto', function(e) {
						if (typeof $pp_pic_holder != 'undefined') {
							if ($pp_pic_holder.is(':visible')) {
								switch (e.keyCode) {
								case 37:
									$.prettyPhoto.changePage('previous');
									e.preventDefault();
									break;
								case 39:
									$.prettyPhoto.changePage('next');
									e.preventDefault();
									break;
								case 27:
									if (!settings.modal)
										$.prettyPhoto.close();
									e.preventDefault();
									break;
								}
								;
							}
							;
						}
						;
					});
		}
		;
		$.prettyPhoto.initialize = function() {
			settings = pp_settings;
			if (settings.theme == 'pp_default')
				settings.horizontal_padding = 16;
			if (settings.ie6_fallback && $.browser.msie
					&& parseInt($.browser.version) == 6)
				settings.theme = "light_square";
			theRel = $(this).attr('rel');
			galleryRegExp = /\[(?:.*)\]/;
			isSet = (galleryRegExp.exec(theRel)) ? true : false;
			pp_images = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
				if ($(n).attr('rel').indexOf(theRel) != -1)
					return $(n).attr('href');
			}) : $.makeArray($(this).attr('href'));
			pp_titles = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
				if ($(n).attr('rel').indexOf(theRel) != -1)
					return ($(n).find('img').attr('alt')) ? $(n).find('img')
							.attr('alt') : "";
			}) : $.makeArray($(this).find('img').attr('alt'));
			pp_descriptions = (isSet) ? jQuery.map(matchedObjects, function(n,
					i) {
				if ($(n).attr('rel').indexOf(theRel) != -1)
					return ($(n).attr('title')) ? $(n).attr('title') : "";
			}) : $.makeArray($(this).attr('title'));
			if (pp_images.length > 30)
				settings.overlay_gallery = false;
			set_position = jQuery.inArray($(this).attr('href'), pp_images);
			rel_index = (isSet) ? set_position : $("a[rel^='" + theRel + "']")
					.index($(this));
			_build_overlay(this);
			if (settings.allow_resize)
				$(window).bind('scroll.prettyphoto', function() {
					_center_overlay();
				});
			$.prettyPhoto.open();
			return false;
		};
		$.prettyPhoto.open = function(event) {
			if (typeof settings == "undefined") {
				settings = pp_settings;
				if ($.browser.msie && $.browser.version == 6)
					settings.theme = "light_square";
				pp_images = $.makeArray(arguments[0]);
				pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $
						.makeArray("");
				pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2])
						: $.makeArray("");
				isSet = (pp_images.length > 1) ? true : false;
				set_position = 0;
				_build_overlay(event.target);
			}
			if ($.browser.msie && $.browser.version == 6)
				$('select').css('visibility', 'hidden');
			if (settings.hideflash)
				$('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css(
						'visibility', 'hidden');
			_checkPosition($(pp_images).size());
			$('.pp_loaderIcon').show();
			if (settings.deeplinking)
				setHashtag();
			if (settings.social_tools) {
				facebook_like_link = settings.social_tools.replace(
						'{location_href}', encodeURIComponent(location.href));
				$pp_pic_holder.find('.pp_social').html(facebook_like_link);
			}
			if ($ppt.is(':hidden'))
				$ppt.css('opacity', 0).show();
			$pp_overlay.show().fadeTo(settings.animation_speed,
					settings.opacity);
			$pp_pic_holder.find('.currentTextHolder').text(
					(set_position + 1) + settings.counter_separator_label
							+ $(pp_images).size());
			if (pp_descriptions[set_position] != "") {
				$pp_pic_holder.find('.pp_description').show().html(
						unescape(pp_descriptions[set_position]));
			} else {
				$pp_pic_holder.find('.pp_description').hide();
			}
			movie_width = (parseFloat(getParam('width', pp_images[set_position]))) ? getParam(
					'width', pp_images[set_position])
					: settings.default_width.toString();
			movie_height = (parseFloat(getParam('height',
					pp_images[set_position]))) ? getParam('height',
					pp_images[set_position]) : settings.default_height
					.toString();
			percentBased = false;
			if (movie_height.indexOf('%') != -1) {
				movie_height = parseFloat(($(window).height()
						* parseFloat(movie_height) / 100) - 150);
				percentBased = true;
			}
			if (movie_width.indexOf('%') != -1) {
				movie_width = parseFloat(($(window).width()
						* parseFloat(movie_width) / 100) - 150);
				percentBased = true;
			}
			$pp_pic_holder
					.fadeIn(function() {
						(settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt
								.html(unescape(pp_titles[set_position]))
								: $ppt.html('');
						imgPreloader = "";
						skipInjection = false;
						switch (_getFileType(pp_images[set_position])) {
						case 'image':
							imgPreloader = new Image();
							nextImage = new Image();
							if (isSet && set_position < $(pp_images).size() - 1)
								nextImage.src = pp_images[set_position + 1];
							prevImage = new Image();
							if (isSet && pp_images[set_position - 1])
								prevImage.src = pp_images[set_position - 1];
							$pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup
									.replace(/{path}/g, pp_images[set_position]);

							imgPreloader.onload = function() {
								pp_dimensions = _fitToViewport(
										imgPreloader.width, imgPreloader.height);
								_showContent();
								
							};
							imgPreloader.onerror = function() {
								alert('Image cannot be loaded. Make sure the path is correct and image exist.');
								$.prettyPhoto.close();
							};
							imgPreloader.src = pp_images[set_position];
							break;
							
						}
						;
						if (!imgPreloader && !skipInjection) {
							$pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
							_showContent();
						}
						;
					});
			return false;
		};
		$.prettyPhoto.changePage = function(direction) {
			currentGalleryPage = 0;
			if (direction == 'previous') {
				set_position--;
				if (set_position < 0)
					set_position = $(pp_images).size() - 1;
			} else if (direction == 'next') {
				set_position++;
				if (set_position > $(pp_images).size() - 1)
					set_position = 0;
			} else {
				set_position = direction;
			}
			;
			rel_index = set_position;
			if (!doresize)
				doresize = true;
			$('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
			_hideContent(function() {
				$.prettyPhoto.open();
			});
		};
		$.prettyPhoto.changeGalleryPage = function(direction) {
			if (direction == 'next') {
				currentGalleryPage++;
				if (currentGalleryPage > totalPage)
					currentGalleryPage = 0;
			} else if (direction == 'previous') {
				currentGalleryPage--;
				if (currentGalleryPage < 0)
					currentGalleryPage = totalPage;
			} else {
				currentGalleryPage = direction;
			}
			;
			slide_speed = (direction == 'next' || direction == 'previous') ? settings.animation_speed
					: 0;
			slide_to = currentGalleryPage * (itemsPerPage * itemWidth);
			$pp_gallery.find('ul').animate({
				left : -slide_to
			}, slide_speed);
		};
		$.prettyPhoto.startSlideshow = function() {
			if (typeof pp_slideshow == 'undefined') {
				$pp_pic_holder.find('.pp_play').unbind('click').removeClass(
						'pp_play').addClass('pp_pause').click(function() {
					$.prettyPhoto.stopSlideshow();
					return false;
				});
				pp_slideshow = setInterval($.prettyPhoto.startSlideshow,
						settings.slideshow);
			} else {
				$.prettyPhoto.changePage('next');
			}
			;
		}
		$.prettyPhoto.stopSlideshow = function() {
			$pp_pic_holder.find('.pp_pause').unbind('click').removeClass(
					'pp_pause').addClass('pp_play').click(function() {
				$.prettyPhoto.startSlideshow();
				return false;
			});
			clearInterval(pp_slideshow);
			pp_slideshow = undefined;
		}
		$.prettyPhoto.close = function() {
			if ($pp_overlay.is(":animated"))
				return;
			$.prettyPhoto.stopSlideshow();
			$pp_pic_holder.stop().find('object,embed').css('visibility',
					'hidden');
			$('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(
					settings.animation_speed, function() {
						$(this).remove();
					});
			$pp_overlay.fadeOut(settings.animation_speed, function() {
				if ($.browser.msie && $.browser.version == 6)
					$('select').css('visibility', 'visible');
				if (settings.hideflash)
					$('object,embed,iframe[src*=youtube],iframe[src*=vimeo]')
							.css('visibility', 'visible');
				$(this).remove();
				$(window).unbind('scroll.prettyphoto');
				clearHashtag();
				settings.callback();
				doresize = true;
				pp_open = false;
				delete settings;
			});
		};
		function _showContent() {
			pp_pic_holder_height = 540;
			$('.pp_loaderIcon').hide();
			$('div.ppt').fadeIn(settings.animation_speed);
			projectedTop = scroll_pos['scrollTop']
					+ ((windowHeight / 2) - (pp_pic_holder_height)/2);
			
			if (projectedTop < 0)
				projectedTop = 0;
			$ppt.fadeTo(settings.animation_speed, 1);
			$pp_pic_holder.find('.pp_content').animate({
				height : pp_dimensions['contentHeight'],
				width : pp_dimensions['contentWidth']
			}, settings.animation_speed);
			
			$('#ndiv').css({ width: 170 });
			$('#ndiv, #pdiv').css({ 
				"width": "170px",
				"margin-top": 	Math.floor(pp_pic_holder_height / 2) - 40
			});
			$('#pp_full_res').css({
				"margin-top" :	Math.max((pp_pic_holder_height - pp_dimensions['contentHeight']) / 2) 
			});
			
			var pdesc ="";
			
			var pdesc = $('.pp_description').text().length;
			
			// alert(pdesc);
			
			if(pdesc > 0)
				{
				 $('.pp_details').slideUp('slow').delay(300).slideDown('slow');
				}
			else
				{
			
				 $('.pp_details').slideUp('fast');
			
				}			
		// 	$('.pp_details').slideUp('slow').delay(1500).slideDown('slow');
			
			$pp_pic_holder.animate({
				'top' : projectedTop,
				'left' : (windowWidth / 2)
						- (pp_dimensions['containerWidth'] / 2),
				width : pp_dimensions['containerWidth']
			}, settings.animation_speed, function() {
				$pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(
						pp_dimensions['height']).width(pp_dimensions['width']);
				$pp_pic_holder.find('.pp_fade')
						.fadeIn(settings.animation_speed);
				if (isSet && _getFileType(pp_images[set_position]) == "image") {
					$pp_pic_holder.find('.pp_hoverContainer').show();
				
				} else {
					$pp_pic_holder.find('.pp_hoverContainer').hide();
		
				}
//				if (pp_dimensions['resized']) {
//					$('a.pp_expand,a.pp_contract').show();
//				} else {
//					$('a.pp_expand').hide();
//				}
				if (settings.autoplay_slideshow && !pp_slideshow && !pp_open)
					$.prettyPhoto.startSlideshow();
				settings.changepicturecallback();
				settings.callback();
				pp_open = true;
			});
			_insert_gallery();
			
		}
		;
		function _hideContent(callback) {
			$pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css(
					'visibility', 'hidden');
			$pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed,
					function() {
						$('.pp_loaderIcon').show();
						callback();
					});
		}
		;
		function _checkPosition(setCount) {
			(setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide();
		}
		;
		function _fitToViewport(width, height) {
			resized = false;
			imageWidth = width, imageHeight = height, pp_commentsWidth = 350;
			_getDimensions(width, height, pp_commentsWidth);
			$('#pp_comments').css('width', pp_commentsWidth);

			if (((pp_containerWidth > windowWidth - pp_commentsWidth) || (pp_containerHeight > windowHeight))
					&& doresize && settings.allow_resize && !percentBased) {
				
				resized = true, fitting = false;
				
				while (!fitting) {
					if ((pp_containerWidth > windowWidth - pp_commentsWidth)) {

						imageWidth = (windowWidth - (pp_commentsWidth + 100));
						imageHeight = (height / width) * imageWidth;
					} else if ((pp_containerHeight > windowHeight)) {
						imageHeight = (windowHeight - 200);
						imageWidth = (width / height) * imageHeight;

					} else {
						fitting = true;
					}
					;
					pp_containerHeight = imageHeight,
							pp_containerWidth = imageWidth;
				}
				;
				_getDimensions(imageWidth, imageHeight, pp_commentsWidth);
				if ((pp_containerWidth > windowWidth)
						|| (pp_containerHeight > windowHeight)) {
					_fitToViewport(pp_containerWidth, pp_containerHeight)
				}
				;
			}
			;
			return {
				width : Math.floor(imageWidth),
				height : Math.floor(imageHeight),
				containerHeight : Math.floor(pp_containerHeight),
				containerWidth : Math.floor(pp_containerWidth)
						+ (settings.horizontal_padding * 2),
				contentHeight : Math.floor(pp_contentHeight),
				contentWidth : Math.floor(pp_contentWidth),
				resized : resized
			};
		}
		;
		
		function _getDimensions(width, height) {
			width = parseFloat(width);
			height = parseFloat(height);
			$pp_details = $pp_pic_holder.find('.pp_details');
			$pp_details.width(width);
			detailsHeight = parseFloat($pp_details.css('marginTop'))
					+ parseFloat($pp_details.css('marginBottom'));
			
			$pp_details = $pp_details.clone().addClass(settings.theme).width(
					width).appendTo($('body')).css({
				'position' : 'absolute',
				'top' : -10000
			});
			detailsHeight += $pp_details.height();

			detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight;
			if ($.browser.msie && $.browser.version == 7)
				detailsHeight += 8;
			$pp_details.remove();
			$pp_title = $pp_pic_holder.find('.ppt');
			$pp_title.width(width);
			if ($pp_title.find('span').length !== 1)
				$pp_title.contents().wrap('<span>');
			$pp_title = $pp_title.clone().appendTo($('body'));
			$pp_title.remove();
			pp_contentHeight = height;
			pp_contentWidth = width + pp_commentsWidth;
			pp_containerHeight = pp_contentHeight
					+ $pp_pic_holder.find('.pp_top').height()
					+ $pp_pic_holder.find('.pp_bottom').height();
			pp_containerWidth = width + pp_commentsWidth;
		}
		function _getFileType(itemSrc) {
			if (itemSrc.match(/youtube\.com\/watch/i)
					|| itemSrc.match(/youtu\.be/i)) {
				return 'youtube';
			} else {
				return 'image';
			}
			;
		}
		;
		function _center_overlay() {
			if (doresize && typeof $pp_pic_holder != 'undefined') {
				scroll_pos = _get_scroll();
				contentHeight = $pp_pic_holder.height(),
						contentwidth = $pp_pic_holder.width();
				projectedTop = (windowHeight / 2) + scroll_pos['scrollTop']
						- (contentHeight / 2);
				if (projectedTop < 0)
					projectedTop = 0;
				if (contentHeight > windowHeight)
					return;
				$pp_pic_holder.css({
					'top' : projectedTop,
					'left' : (windowWidth / 2) + scroll_pos['scrollLeft']
							- (contentwidth / 2)
				});
			}
			;
		}
		;
		function _get_scroll() {
			if (self.pageYOffset) {
				return {
					scrollTop : self.pageYOffset,
					scrollLeft : self.pageXOffset
				};
			} else if (document.documentElement
					&& document.documentElement.scrollTop) {
				return {
					scrollTop : document.documentElement.scrollTop,
					scrollLeft : document.documentElement.scrollLeft
				};
			} else if (document.body) {
				return {
					scrollTop : document.body.scrollTop,
					scrollLeft : document.body.scrollLeft
				};
			}
			;
		}
		;
		function _resize_overlay() {
			windowHeight = $(window).height(), windowWidth = $(window).width();
			if (typeof $pp_overlay != "undefined")
				$pp_overlay.height($(document).height()).width(windowWidth);
		}
		;
		function _insert_gallery() {
			if (isSet
					&& settings.overlay_gallery
					&& _getFileType(pp_images[set_position]) == "image"
					&& (settings.ie6_fallback && !($.browser.msie && parseInt($.browser.version) == 6))) {
				itemWidth = 52 + 5;
				navWidth = (settings.theme == "facebook" || settings.theme == "pp_default") ? 50
						: 30;
				itemsPerPage = Math
						.floor((pp_dimensions['containerWidth'] - 100 - navWidth)
								/ itemWidth);
				itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage
						: pp_images.length;
				totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;
				if (totalPage == 0) {
					navWidth = 0;
					$pp_gallery.find('.pp_arrow_next,.pp_arrow_previous')
							.hide();
				} else {
					$pp_gallery.find('.pp_arrow_next,.pp_arrow_previous')
							.show();
					
				}
				;
				galleryWidth = itemsPerPage * itemWidth;
				fullGalleryWidth = pp_images.length * itemWidth;
				
				$pp_gallery.css('margin-left',
						-((galleryWidth / 2) + (navWidth / 2))).find(
						'div:first').width(galleryWidth + 5).find('ul').width(
						fullGalleryWidth).find('li.selected').removeClass(
						'selected');
						
				goToPage = (Math.floor(set_position / itemsPerPage) < totalPage) ? Math
						.floor(set_position / itemsPerPage)
						: totalPage;
				
				
				  $pp_gallery_li.filter(':eq(' + set_position + ')').addClass(
						'selected');
				 			 
				  $.prettyPhoto.changeGalleryPage(goToPage);
						
				
			} else {
				$pp_pic_holder.find('.pp_content').unbind(
						'mouseenter mouseleave');
			}
		}
		function _build_overlay(caller) {
			if (settings.social_tools)
				facebook_like_link = settings.social_tools.replace(
						'{location_href}', encodeURIComponent(location.href));
			settings.markup = settings.markup.replace('{pp_social}',
					(settings.social_tools) ? facebook_like_link : '');
			$('body').append(settings.markup);
			$pp_pic_holder = $('.pp_pic_holder'), $ppt = $('.ppt'),
					$pp_overlay = $('div.pp_overlay');
			if (isSet && settings.overlay_gallery) {
				
				currentGalleryPage = 0;
				toInject = "";
				for ( var i = 0; i < pp_images.length; i++) {
					if (!pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)) {
						classname = 'default';
						img_src = '';
					} else {
						classname = '';
						img_src = pp_images[i];
					}
					var thumb_image = img_src;
					new_thumb = thumb_image.replace ("960/540/", "80/45/");
					toInject += "<li class='" + classname
							+ "'><a href='#'><img src='" + new_thumb
							+ "'  alt='' /></a></li>";
				};
				
				toInject = settings.gallery_markup.replace(/{gallery}/g,
						toInject);
				$pp_pic_holder.find('#pp_full_res').after(toInject);
				$pp_gallery = $('.pp_pic_holder .pp_gallery'),
						$pp_gallery_li = $pp_gallery.find('li');
				$pp_gallery.find('.pp_arrow_next').click(function() {
					$.prettyPhoto.changeGalleryPage('next');
					$.prettyPhoto.stopSlideshow();
					return false;
				});
				$pp_gallery.find('.pp_arrow_previous').click(function() {
					$.prettyPhoto.changeGalleryPage('previous');
					$.prettyPhoto.stopSlideshow();
					return false;
				});
				
				
				$pp_pic_holder.find('.pp_content').hover(
						function() {
							
							
	//$('.pp_details').fadeIn(100);
	

		$('.pp_details').slideDown();	
		
	 
	
	
	$('.currentTextHolder').css("display","block");
							 $('#next-light').css("display","block");
						 $('#prev-light').css("display","block");
							
							//	$("a.pp_next").show();
							// $pp_pic_holder.find('.pp_gallery:not(.disabled)')							.fadeIn();
						},
						function() {
						        $('.currentTextHolder').css("display","none");
						        $('.pp_details').slideUp();	
							 $('#next-light').css("display","none");
							 $('#prev-light').css("display","none");
						// $pp_pic_holder.find('.pp_gallery:not(.disabled)')							.fadeOut();
						});
				itemWidth = 52 + 5;
				$pp_gallery_li.each(function(i) {
					$(this).find('a').click(function() {
						$.prettyPhoto.changePage(i);
						$.prettyPhoto.stopSlideshow();
						return false;
					});
				});
			

				$pp_pic_holder.find('#ndiv').hover(
						function() {
			
     
							
           $('#next-light').css("display","none");   
           
                                                        
          
	// (set_position + 1) + settings.counter_separator_label + $(pp_images).size());
							
							var nLength = set_position + 2;
							if(nLength >  $(pp_images).size())
						{
				             var nLength =  1;
				          
						}
							var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
							
				$("#nImage").html(nImage);
			
				
				
							
						},
						function() {
						
							
					 $("#nImage").empty();
						 $('#next-light').css("display","block"); 
						
						});
				itemWidth = 52 + 5;
				
			
				$pp_gallery_li.each(function(i) {
					$(this).find('a').click(function() {
						$.prettyPhoto.changePage(i);
						$.prettyPhoto.stopSlideshow();
						return false;
					});
				});
				
				
				
				$pp_pic_holder.find('#pdiv').hover(
						function() {
							
				$('#prev-light').css("display","none"); 
						// alert("previous one goes here ");
							
							   
							var nLength = set_position;
							if(nLength == 0)
							{
					             var nLength =  $(pp_images).size();
					          
							}
							
							var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
							$("#pImage").html(nImage);
							
					
							// $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
						},
						function() {
							// $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
						 $("#pImage").empty();
                                                         $('#prev-light').css("display","block"); 
						});
				itemWidth = 52 + 5;
				$pp_gallery_li.each(function(i) {
					$(this).find('a').click(function() {
						$.prettyPhoto.changePage(i);
						
						$.prettyPhoto.stopSlideshow();
						return false;
					});
				});

			}
			;
			if (settings.slideshow) {
				$pp_pic_holder.find('.pp_nav').prepend(
						'<a href="#" class="pp_play">Play</a>');
				$pp_pic_holder.find('.pp_nav .pp_play').click(function() {
					$.prettyPhoto.startSlideshow();
					return false;
				});
			}
			$pp_pic_holder.attr('class', 'pp_pic_holder ' + settings.theme);
			$pp_overlay.css({
				'opacity' : 0,
				'height' : $(document).height(),
				'width' : $(window).width()
			}).bind('click', function() {
				if (!settings.modal)
					$.prettyPhoto.close();
			});
			$('a.pp_close').bind('click', function() {
				$.prettyPhoto.close();
				return false;
			});
			$('a.pp_expand').bind('click', function(e) {
				if ($(this).hasClass('pp_expand')) {
					$(this).removeClass('pp_expand').addClass('pp_contract');
					doresize = false;
				} else {
					$(this).removeClass('pp_contract').addClass('pp_expand');
					doresize = true;
				}
				;
				_hideContent(function() {
					$.prettyPhoto.open();
				});
				return false;
			});
			
			
			$pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous')
					.bind('click', function()

					{
						
						// This is the left side of the arrow button , termed as next
					
						var nLength = set_position;
						if(nLength == 0)
						{
				             var nLength =  $(pp_images).size();
				          
						}
						var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
						
						$("#pImage").html(nImage);
						
										

						$('.pp_details').slideUp('fast').delay(30);
						
					
						$.prettyPhoto.changePage('previous');
					

						  $("#pImage").empty();
						
						   var nLength = set_position;
						   if(nLength == 0)
							{
					             var nLength =  $(pp_images).size();
					          
							}
						   var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
						   
							$("#pImage").hide().delay(500).html(nImage).fadeIn('slow');
							 
							 
						$.prettyPhoto.stopSlideshow();
						
						$('div.ppt').fadeOut(settings.animation_speed);
						return false;
					});
			
			$pp_pic_holder.find('#pdiv, #ndiv').bind(
					'mouseenter', function() {
						$(this).addClass("hovered");
			});
			
			$pp_pic_holder.find('#pdiv, #ndiv').bind(
					'mouseleave', function() {
						$(this).removeClass("hovered");
			});
			
			$pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind(
					'click', function() {
						
						// this is the right side of the arrow button , termed as previous
						//alert("previous"); this is the only place where error pops up 
						
						var nLength = set_position + 2;
							if(nLength >  $(pp_images).size())
						{
				             var nLength =  1;
				          
						}
							var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
						
												
						    $("#nImage").html(nImage);
						
						   $('.pp_details').slideUp('fast').delay(30);
					$.prettyPhoto.changePage('next');
					
					 $("#nImage").empty();
					   var nLength = set_position + 2;
					   if(nLength > $(pp_images).size())
						{
				             var nLength =  1;
				          
						}
					   
					   var nImage = $("#sthumbs  li:nth-child("+nLength+")").html();
					
						$("#nImage").hide().delay(500).html(nImage).fadeIn('slow');
			
						$.prettyPhoto.stopSlideshow();
						
						$('div.ppt').fadeOut(settings.animation_speed);
					
						return false;
					});
			_center_overlay();			
		};
		
		// Will load the Disqus for the first time the lightbox is lunched
		initiate_disqus = function () {
	    	    disqus_developer = 1;
			    disqus_identifier = $pp_pic_holder.find("#pp_full_res img").attr("src");
			    disqus_url = $pp_pic_holder.find("#pp_full_res img").attr("src");
			    disqus_container_id = 'disqus_thread'; 
			    disqus_category_id = '1728929';
			    disqus_shortname = 'skynewsarabia';
			    disqus_config = function () {
				    this.callbacks.onReady.push(function() {
				    	lightboxCommentsScroll();
					});
				    this.callbacks.onNewComment.push(function() {				    	
				    	lightboxCommentsScroll();
					});   
				};
				(function() {
			        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true; dsq.id = 'disqusCommentScript';
			        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
			        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	    	    })();

		};
		
		// Will reload the Disqus when the image is changed
		reload_disqus = function () {
			
				// Empty disqus container
				$('#disqus_thread').empty();	
				
				// Remove Disquss object
				removeDisqus();
				
				//Reinitiate Disqus				
				initiate_disqus();				
		};
		
		// This will be called when you close the lightbox
		removeDisqus = function () {			
			// Remove Disquss object
			oldDsq = $('head').find('disqusCommentScript');

			if(oldDsq){
				oldDsq.remove();
				try 
				{ 
					 window.DISQUS = undefined; 
				} 
				catch(e) 
				{ 
				    window["DISQUS"] = undefined; 
				}		
			}
		};
		
		// Scroll through the comments
		lightboxCommentsScroll = function () {		
			if ($('.jspContainer').length === 0){
				 $('#dsq-comments').jScrollPane({showArrows: true, animateTo:true, autoReinitialise: true}); 
			}else{
				if ($('#dsq-comments  > :last').find('.child').length === 0 && $('#dsq-comments').children().length > 1 ){
					console.log('Not Child');
					$('#dsq-comments  > :last').appendTo('.jspPane'); 
					var pane = $('#dsq-comments');
					var api = pane.data('jsp');
			        api.destroy();
			        
			        $('#dsq-comments').jScrollPane({showArrows: true, animateTo:true, autoReinitialise: true}); 
				        var pane = $('#dsq-comments');
						var api = pane.data('jsp');
				        api.scrollToY(99999999, true);
				}
			}
        };

		if (!pp_alreadyInitialized && getHashtag()) {
			pp_alreadyInitialized = true;
			hashIndex = getHashtag();
			hashRel = hashIndex;
			hashIndex = hashIndex.substring(hashIndex.indexOf('/') + 1,
					hashIndex.length - 1);
			hashRel = hashRel.substring(0, hashRel.indexOf('/'));
			setTimeout(function() {
				$("a[rel^='" + hashRel + "']:eq(" + hashIndex + ")").trigger(
						'click');
			}, 50);
		}
		return this.unbind('click.prettyphoto').bind('click.prettyphoto',
				$.prettyPhoto.initialize);
	};
	function getHashtag() {
		url = location.href;
		hashtag = (url.indexOf('#!') != -1) ? decodeURI(url.substring(url
				.indexOf('#!') + 2, url.length)) : false;
		return hashtag;
	}
	;
	function setHashtag() {
		if (typeof theRel == 'undefined')
			return;
		location.hash = '!' + theRel + '/' + rel_index + '/';
	}
	;
	function clearHashtag() {
		url = location.href;
		hashtag = (url.indexOf('#!prettyPhoto') > 0) ? true : false;
		if (hashtag)
			location.hash = "!prettyPhoto";
	}
	function getParam(name, url) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(url);
		return (results == null) ? "" : results[1];
	}
	
	
})(jQuery);
var pp_alreadyInitialized = false;
var disqus_alreadyInitialized = false;