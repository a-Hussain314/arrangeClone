import {Platform, StyleSheet} from 'react-native';
import {height, width} from '../../../../constants/screenSize';
import {colors, fonts} from '../../../../Theme';
import {CommonStyles} from '../../../../assets/css';

export const style = StyleSheet.create({
  sliderContainer: {width: '100%'},

  sliderImg: {height: width * 0.5, borderRadius: 10},

  carouselContainer: {
    // backgroundColor:'red',
    paddingHorizontal: width * (21 / 375),
    paddingTop: width * (13 / 375),
    zIndex: 2,
  },
  activeDot: {
    width: width * (10 / 375),
    height: width * (10 / 375),
    borderRadius: 100,
    marginHorizontal: -5,
    backgroundColor: colors.themeColor,
  },
  inactiveDot: {
    width: width * (18 / 375),
    height: width * (18 / 375),
    borderRadius: 100,
    // backgroundColor: colors.sliderInactivDot,
  },
  paginationContainer: {
    // backgroundColor: colors.bgColor,
    paddingHorizontal: width * (21 / 375),
    zIndex: 1,
    height: width * (40 / 375),
  },
  dotContainer: {
    // color: colors.transparent,
    width: width * 0.89,
    marginTop: -25,
    zIndex: 1,
    height: width * (90 / 375),
  },
  treatmentOption: {
    height: width * (81 / 375),
    width: width * (81 / 375),
    borderRadius: width * (10 / 375),
    borderWidth: 0.5,
    borderColor: colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treatmentOptionImg: {
    height: width * (32 / 375),
    width: width * (32 / 375),
    resizeMode: 'contain',
    tintColor: colors.darkShade,
  },
  treatmentOptionImg_2: {
    height: width * (32 / 375),
    width: width * (32 / 375),
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
  },
  treatmentCategoryContainer: {
    paddingHorizontal: width * (21 / 375),
  },
  treatmentOptionTitle: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: width * (10 / 375),
    marginTop: width * (10 / 375),
  },
  treatmentOptionTitle_1: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: width * (10 / 375),
    paddingVertical: width * (2 / 375),

    //  marginTop: 10,
    backgroundColor: colors.whiteColor,
    borderBottomLeftRadius: width * (10 / 375),
    borderBottomRightRadius: width * (10 / 375),
  },
  treatmentTitle: {
    fontSize: width * 0.025,
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.darkShade,
    textAlign: 'center',
  },
  renderOuterView: {
    marginLeft: width * (10 / 375),
    width: width * (164 / 375),
    marginRight: width * (10 / 375),
    marginTop: width * (10 / 375),
  },
  image: {
    height: width * (139 / 375),
    width: width * (164 / 375),
    borderTopLeftRadius: width * (10 / 375),
    borderTopRightRadius: width * (10 / 375),
    //bottom: Platform.OS === 'ios' ? 0 : 150
  },
  titleText: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
  },
  ratingOuter: {
    backgroundColor: 'rgb(11,199,117)',
    flexDirection: 'row',
    paddingVertical: width * (2 / 375),
    paddingHorizontal: width * (10 / 375),
    borderRadius: width * (5 / 375),
  },
  marker_ratingOuter: {
    backgroundColor: 'rgb(11,199,117)',
    flexDirection: 'row',
    paddingVertical: width * (3 / 375),
    paddingHorizontal: width * (8 / 375),
    borderRadius: width * (5 / 375),
  },
  sterImg: {
    justifyContent: 'center',

    // borderWidth: 1
  },
  rateText: {
    color: colors.whiteColor,
    marginLeft: width * (2 / 375),
  },
  reviewView: {
    justifyContent: 'center',
    paddingLeft: width * (10 / 375),
  },
  reviewText: {
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  locationOuter: {
    flexDirection: 'row',
    paddingVertical: width * (5 / 375),
    paddingHorizontal: width * (10 / 375),
    borderRadius: width * (5 / 375),
  },
  marker_locationOuter: {
    flexDirection: 'row',
    paddingVertical: width * (5 / 375),
    //paddingHorizontal: width * (10 / 375),
    borderRadius: width * (5 / 375),
  },
  locationImg: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: width * (5 / 375),
    width: 25,
    height: 25,
  },
  locationText: {
    marginLeft: 5,
    fontSize: width * (10 / 375),
    color: colors.themeColor,
  },

  map: {
    height: height * 0.89,
    width: '100%',
  },
  mapCustomIcon: {
    backgroundColor: 'rgba(30 ,105 ,179 ,0.3)',
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  infoWindoOuter: {width: 200, flexDirection: 'row'},
  infoDetailOuter: {width: '80%'},
  infoUserIconOuter: {
    width: '20%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    alignContent: 'flex-start',
  },
  infoTitle: {fontSize: 15},
  infoUserName: {fontSize: 12},
  profileImage: {width: 30, height: 30},

  marker_renderOuterView: {
    flexDirection: 'row',
    marginTop: width * (10 / 375),

    paddingBottom: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 2,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    //  marginRight: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  marker_image: {
    // borderWidth: 5,
    height: width * (88 / 375),
    width: width * (88 / 375),
    borderRadius: 10,
    zIndex: 100,
  },
});
