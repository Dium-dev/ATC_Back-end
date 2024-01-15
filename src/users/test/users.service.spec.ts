import { AuthService } from "src/auth/auth.service"
import { UsersService } from "../users.service"
import { ShoppingCartService } from "src/shopping-cart/shopping-cart.service"
import { DirectionsService } from "src/directions/directions.service"
import { ReviewsService } from "src/reviews/reviews.service"
import { OrdersService } from "src/orders/orders.service"
import { PaymentsService } from "src/payments/payments.service"
import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/sequelize"
import { User } from "../entities/user.entity"
import { ShoppingCart } from "src/shopping-cart/entities/shopping-cart.entity"
import { newFakeUser } from "./faker"
import { Direction } from "src/directions/entities/direction.entity"
import { Review } from "src/reviews/entities/review.entity"
import { Order } from "src/orders/entities/order.entity"
import { Payment } from "src/payments/entities/payment.entity"
import { MailService } from "src/mail/mail.service"
import { Sequelize } from "sequelize-typescript"
import { JwtService } from "@nestjs/jwt"
import { CartProduct } from "src/shopping-cart/entities/cart-product.entity"
import { OrderProduct } from "src/orders/entities/orderProduct.entity"
import { ProductsService } from "src/products/products.service"
import { Product } from "src/products/entities/product.entity"
import { AdminProductsService } from "src/admin-products/admin-products.service"


describe('User Service Unitest', () => {
    let usersService: UsersService
    let authService: AuthService
    let shoppingCartService: ShoppingCartService
    let directionService: DirectionsService
    let reviewsSerice: ReviewsService
    let orderService: OrdersService
    let paymentService: PaymentsService
    let mailService: MailService

    let user: typeof User
    let shopping: typeof ShoppingCart
    let direction: typeof Direction
    let review: typeof Review
    let order: typeof Order
    let payment: typeof Payment



    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                UsersService,
                {
                    provide: getModelToken(User),
                    useValue: {
                        create: jest.fn((newUser) => newUser)
                    }
                },
                AuthService,
                AdminProductsService,
                ProductsService,
                {
                    provide: getModelToken(Product),
                    useValue: {}
                },
                ShoppingCartService,
                {
                    provide: getModelToken(ShoppingCart),
                    useValue: {}
                },
                {
                    provide: getModelToken(CartProduct),
                    useValue: {}
                },
                DirectionsService,
                {
                    provide: getModelToken(Direction),
                    useValue: {}
                },
                ReviewsService,
                {
                    provide: getModelToken(Review),
                    useValue: {}
                },
                OrdersService,
                {
                    provide: getModelToken(Order),
                    useValue: {}
                },
                {
                    provide: getModelToken(OrderProduct),
                    useValue: {}
                },
                PaymentsService,
                {
                    provide: getModelToken(Payment),
                    useValue: {}
                },
                MailService,
                Sequelize,
                JwtService
            ]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        shoppingCartService = module.get<ShoppingCartService>(ShoppingCartService);
        authService = module.get<AuthService>(AuthService);
        directionService = module.get<DirectionsService>(DirectionsService);
        reviewsSerice = module.get<ReviewsService>(ReviewsService);
        orderService = module.get<OrdersService>(OrdersService);
        paymentService = module.get<PaymentsService>(PaymentsService);
        mailService = module.get<MailService>(MailService);

        user = module.get<typeof User>(getModelToken(User));
        shopping = module.get<typeof ShoppingCart>(getModelToken(ShoppingCart));
        direction = module.get<typeof Direction>(getModelToken(Direction));
        review = module.get<typeof Review>(getModelToken(Review));
        order = module.get<typeof Order>(getModelToken(Order));
        payment = module.get<typeof Payment>(getModelToken(Payment));

    })

    describe('The function create User must create an User With his own Shopp Cart', () => {

        it('It should create an User', () => {
            jest.spyOn(user, 'create').mockImplementation((newUser) => newUser)
            const response = usersService.create(newFakeUser())

            expect(response).toHaveProperty('statusCode', 201)
            expect(response).toHaveProperty('token', /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/)
        })

        /* it('It should have called the ShoppingCart.service to create his Shopp Cart', () => {

        })

        it('It should have ', () => {

        }) */

    })


})