/**
 * Created by FanJiaHe on 2016/3/3.
 */

//
// 工厂方法模式（Factory method pattern）
//
// 工厂方法模式（Factory method pattern）是一种实现“工厂”概念的面上对象设计模式。实质是定义一个创建对象的接口，但是让实现这个接口的类来决定实例化哪个类。工厂方法让类的实例化推迟到子类中进行。
// 创建一个对象常常需要复杂的过程，所以不适合在一个复杂的对象中。创建对象可能会导致大量的重复代码，也可能提供不了足够级别的抽象。工厂方法模式通过定义一个单独的创建对象的方法来解决这些问题，由子类实现这个方法来创建具体类型的对象。
//
// //几个Button类
// class Button{/* ...*/}
// class WinButton extends Button{/* ...*/}
// class MacButton extends Button{/* ...*/}
//
// //它们的工厂类
// interface ButtonFactory{
//     abstract Button createButton();
// }
// class WinButtonFactory implements ButtonFactory{
//     Button createButton(){
//     return new WinButton();
// }
// }
//
// class MacButtonFactory implements ButtonFactory{
//     Button createButton(){
//     return new MacButton();
// }
// }
//
// 在JS中创建对象会习惯的使用 new 关键字和类构造函数（当然主要还是对象字面量），问题在于这样会导致两个类之间产生依赖性。
// 工厂模式就是一种有助于消除两个类依赖性的模式。
// 简单工厂模式：使用一个类（通常为单体）来生成实例。
// 复杂工厂模式：使用子类来决定一个成员变量应该是哪个具体的类的实例。
//
// 实现1：简单工厂模式
//
// 上 JS设计模式 上的实例， 对于自行车商店出售自行车：
//
// /* BicycleShop class */
// var BicycleShop = function(){};
// BicycleShop.prototype = {
//
//     sellBicycle : function( model ){
//         var bicycle;
//         switch( model ){
//             case "The Speedster":
//                 bicycle = new Speedster();
//                 break;
//             case "The Lowrider":
//                 bicycle = new Lowrider();
//                 break;
//             case "The Cruiser":
//             default:
//                 bicycle = new Cruiser();
//                 break;
//         }
//         return bicycle;
//     }
// }
//
// sellBicycle 方法根据所提供的自行车型号来进行自行车的实例创建。那么对于一家ABC店铺，需要Speedster车型我只需要
// var ABC = new BicycleShop();
// var myBike = ABC.sellBicycle("The Speedster");
//
//
// 以上方式很管用，但是一旦说我需要添加一些自行车款式的时候我就必须修改 BicycleShop 的 switch 部分，那么只要是修改就有可能带来BUG。所以，将这部分生成实例的代码单独的提出来分工交给一个简单的工厂对象是一个很不错的方法。
//
//
// var BicycleFactory = {
//     createBicycle : function( model ){
//         var bicycle;
//         switch( model ){
//             case "The Speedster":
//                 bicycle = new Speedster();
//                 break;
//             case "The Lowrider":
//                 bicycle = new Lowrider();
//                 break;
//             case "The Cruiser":
//             default:
//                 bicycle = new Cruiser();
//                 break;
//         }
//         return bycicle;
//     }
// }
//
//     BicycleFactory 是一个脱离于BicycleShop的单体。降低耦合度的效果显而易见。当需要添加新的类型的时候，不需要动 BicycleShop 只需修改工厂单体对象就可以。
//
// var BicycleShop = function(){};
//
//     BicycleShop.prototype = {
//         sellBicycle : function( model ){
//             var bicycle = BicycleFactory.createBicycle(model);
//             return bicycle;
//         }
//     }
//
//     以上就是一个很好的 简单工厂模式 的实例。该模式将成员对象的创建工作交给一个外部对象实现，该外部对象可以是一个简单的命名空间，也可以是一个类的实例。
//
// 实现2：工厂模式
//
//     真正的工厂模式与简单工厂模式相比，主要区别就是它不是另外使用一个对象或者类来创建实例（自行车），而是使用一个子类。工厂是一个将其成员对象的实例化推迟到子类中进行的类。
//
//
//     比如加入BicycleShop可以决定从那一家厂商进行进货，那么简单的一个BicycleFactory是不够了的，因为各个厂商会各自生产不同的Speedster，Lowrider，Cruiser等型号自行车，所以首先需要生成各自厂商的shop实例，不同厂商的shop实例拥有不同的生成几个型号自行车的方法。
//
//     也就是相当于将自行车对象的实例化推迟到了shop实例中产生。
//     基础：
//
// var BicycleShop = function(){}
//
//     BicycleShop.prototype={
//         sellBicycle: function( model ){
//             var bicycle = this.createBicycle( model );
//             return bicycle;
//         },
//         createBicycle: function( model ){
//             throw new Error( " Unsupported " );
//         }
//     }
//
//     各自厂商：
//
// var AcmeBicycleShop = function(){};
//
//     extend( AcmeBicycleShop , BicycleShop );
//     AcmeBicycleShop.prototype.createBicycle = function( model ){
//         var bicycle;
//         switch( model ){
//             case "The Speedster":
//                 bicycle = new AcmeSpeedster();
//                 break;
//             case "The Lowrider":
//                 bicycle = new AcmeLowrider();
//                 break;
//             case "The Cruiser":
//             default:
//                 bicycle = new AcmeCruiser();
//                 break;
//         }
//         return bicycle;
//     }
//
//     var GeneralBicycleShop = function(){};
//
//     extend( GeneralBicycleShop , BicycleShop );
//     GeneralBicycleShop.prototype.createBicycle = function( model ){
//         ...
//     }
//
//     那么接下来就很简单 对于来自 Acme 进货的
//
//     var acmeShop = new AcmeBicycleShop();
//     var newBicycle = acmeShop.sellBicycle("The Speedster");
//
//     当然，你也可以对于外层生成的子类实例在使用简单工厂模式进行包装一下~对于添加其他厂商也很简单，在创建一个Bicycle的子类重新定义其createBicycle的工厂方法即可。
//
//
//     工厂模式使用场合
//
//     1. 动态实现
//     例如自行车的例子，创建一些用不同方式实现统一接口的对象，那么可以使用一个工厂方法或者简单工厂对象来简化实现过程。选择可以是明确进行的也可以是隐含的。
//
//     2. 节省设置开销
//     如果对象要进行复杂的并且彼此相关的设置的时候，那么工厂模式可以很显著的减少每种对象的代码量。将特定的设置代码提取出来会使得代码有极大地提升。并且能优化结构便于维护。
//
//     3. 用于许多小型对象组成一个大对象。
//
//     4. 工厂模式之利
//     主要好处就是可以消除对象间的耦合，通过使用工程方法而不是new关键字。将所有实例化的代码集中在一个位子防止代码重复。
//
//     5. 工厂模式之弊
//     大多数类最好使用new关键字和构造函数，可以让代码更加简单易读。而不必去查看工厂方法来知道。




// 抽线工厂
// 抽象工厂模式说明
//
// 1. 工厂方法模式的问题: 在工厂方法模式里，创建类都需要通过 工厂类，如果要扩展程序，就必须修改工厂类，这违背了闭包原则，对扩展开放，对修改关闭；对于设计有一定的问题。
//
// 2. 如何解决：就要用到抽象工厂模式，就是对功能类单独创建工厂类，这样就不必修改之前的代码，又扩展了功能。
//
// 3. 工厂模式其实就是对 实现同一接口的 实现类 的 统一 工厂方式创建调用，但 javascript 没有接口这号东西，所以就去掉这一层 实现，但位功能类的成员及方法都应当一样;
//
// 抽象工厂源码例子
//
// 1. 邮件发送类:
//
//     复制代码
// function MailSender() {
//     this.to = '';
//     this.title = '';
//     this.content = '';
// }
//
// MailSender.prototype.send = function() {
//     //send body
// }
// 复制代码
// 2. 短信发送类:
//
//     复制代码
// function SmsSender() {
//     this.to = '';
//     this.title = '';
//     this.content = '';
// }
//
// SmsSender.prototype.send = function() {
//     //send body
// }
// 复制代码
// 3. 这里本来是创建工厂接口类，这里就去掉了; 直接创建各功能类工厂;
//
// 1>. 邮件工厂类:
//
//     function MailFactory() {
//
//     }
// MailFactory.prototype.produce = function() {
//     return new MailSender();
// }
// 2>. 短信工厂类:
//
//     function SmsFactory() {
//
//     }
// SmsFactory.prototype.produce = function() {
//     return new SmsSender();
// }
// 4. 使用方法:
//
//     var factory = new MailFactory();
// var sender = factory.produce();
// sender.to = 'toname#mail.com';
// sender.title = '抽象工厂模式';
// sender.content = '发送内容';
// sender.send();
// 其他说明
//
// 在面向对象语言如 java，.net C# 使用的工厂模式，都用到接口，接口是对外向各种用户暴露的可用方法，说明这个功能应用有些什么的方法应用，用户应该怎么用这个接口。对象以类的形式表现出来，代表现实世界中的某种抽象，也许场景会有很多类似的应用，比如上面的 邮件发送，短信发送，再比如商场中的各种促销手段，以及动物世界中的各种飞禽走兽等..
//
//     如果我们不以接口形式提供用户使用，势必提供暴露真实的功能类对象给用户，用户可以随意对类对象进行修改跟扩展，这是不允许的。
//
// 工厂方法模式 跟 抽象工厂模式可以很好的解决这样的问题，用户只能使用接口调用工厂类，来进行规定的操作；抽象工厂模式更进一步使用扩展功能变得容易，功能类跟工厂类都在实现相应的接口上实现各自类级别的扩展，不会涉及修改到其他的类或方法；

// 总的来说类似于c++的继承和多态了
// 先创建一个基础的工厂类,用于对其子类的创建
var BicycleShop = function()
{
};

BicycleShop.prototype.sellBicycle = function(model)
{
    var bicycle = this.createBicycle(model);
    return bicycle;
};

BicycleShop.prototype.createBicycle = function(model)
{
    throw new Error(" Unsupported ");
};


// 子类之一, 原型到父类的亲
var AcmeBicycleShop = function()
{
};
AcmeBicycleShop.prototype = new BicycleShop();
AcmeBicycleShop.prototype.createBicycle = function(model)
{
    var bicycle;
    switch (model)
    {
        case "The Speedster":
            console.log("create the speedster bicycle");
            // bicycle = new AcmeSpeedster();
            break;
        case "The Lowrider":
            console.log("create the lowrider bicycle");
            // bicycle = new AcmeLowrider();
            break;
        case "The Cruiser":
            console.log("create the cruiser bicycle");
            break;
        default:
            // bicycle = new AcmeCruiser();
            break;
    }
    return bicycle;
};



// 子类之二
var GeneralBicycleShop = function()
{
};
GeneralBicycleShop.prototype = new BicycleShop();



var acmeShop = new AcmeBicycleShop();
var newBicycle = acmeShop.sellBicycle("The Speedster");