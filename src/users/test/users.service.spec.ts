import { AuthService } from "src/auth/auth.service"
import { UsersService } from "../users.service"
import { ShoppingCartService } from "src/shopping-cart/shopping-cart.service"
import { DirectionsService } from "src/directions/directions.service"
import { ReviewsService } from "src/reviews/reviews.service"
import { OrdersService } from "src/orders/orders.service"
import { PaymentsService } from "src/payments/payments.service"
import { Test, TestingModule } from "@nestjs/testing"

const limitsServiceMock = {
    verifyLimit: jest.fn(),
    someOtherMethod: jest.fn()
};


describe('User Service Unitest', () => {
    let usersService: UsersService
    let authService: AuthService
    let shoppingCartService: ShoppingCartService
    let directionService: DirectionsService
    let reviewsSerice: ReviewsService
    let orderService: OrdersService
    let paymentService: PaymentsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                UsersService,
                {
                    provide: AuthService,
                    useValue: limitsServiceMock
                },
                {
                    provide: ShoppingCartService,
                    useValue: limitsServiceMock
                },
                {
                    provide: DirectionsService,
                    useValue: limitsServiceMock
                },
                {
                    provide: ReviewsService,
                    useValue: limitsServiceMock
                },
                {
                    provide: OrdersService,
                    useValue: limitsServiceMock
                },
                {
                    provide: PaymentsService,
                    useValue: limitsServiceMock
                }
            ]
        }).compile();


    })

    it('Should create an User with his oun Shopping cart', () => {

    })
})