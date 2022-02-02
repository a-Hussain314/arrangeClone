#import "AppDelegate.h"
#import <React/RCTLinkingManager.h>"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import "RNFBMessagingModule.h"
#import "RNSplashScreen.h"
#import <GoogleMaps/GoogleMaps.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
@import UIKit;
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
  }
  [GMSServices provideAPIKey:@"AIzaSyA3HhAJU-lKPVrv9bU8NULkIhUQMucFvKY"];

#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Arrange"
                                            initialProperties:appProperties];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
   [RNSplashScreen show];
  return YES;
}


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handleRCT;
    
//    return [[RNFirebaseLinks instance] application:application openURL:url options:options] || [[Twitter sharedInstance] application:application openURL:url options:options];
  
  if ([url.scheme caseInsensitiveCompare:@"com.simicart.enterprise.payments"] == NSOrderedSame) {
         // send notification to get payment status
       [[NSNotificationCenter defaultCenter] postNotificationName:@"getStatusOrder" object:url];
         handleRCT = YES;
     } else {
         handleRCT = [RCTLinkingManager application:application openURL:url options:options];
     }
  
  return self;
}

- (instancetype)init{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getStatusOder:) name:@"getStatusOrder" object:nil];
    }
    return self;
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}



@end
