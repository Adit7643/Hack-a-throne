function logger()
{
    const myCarousel = document.getElementById("carouselExampleAutoplaying");

    const carouselInstance = bootstrap.Carousel.getInstance(myCarousel);
    if (carouselInstance) {
        carouselInstance.pause();
    }

    const log = document.getElementById("ln");
    log.innerHTML = `<div class="lpage"  autofocus="true" onfocus="true">
    <div class="row">
        <h3 class="sign col-11">Login</h3>
        <span class="close-button col-1" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </span>
    </div>
    <form action="/login" class="form" method="post">
        <div class="row">
            <div class="col-8">
                <input type="email" placeholder="Email" class="form-control inp " name="mail" required>
            </div>
        </div>
        
        <div class="row">
            <div class="col-8">
                <input type="password" class="form-control inp pass" name="password" placeholder="Password" required>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="submit" class="form-control inp cr-acc" value="Login" required>
            </div>
        </div>
    </form>
    <div class="row">
            <div class="col">
                <a href="/auth/google" role="button" class="inp google-login">
    <img src="/images/Google__G__logo.svg.png" class="google-img" alt="Google logo">
    Continue With Google
</a>
</div>
        </div>
    <button class="state al-acc" onclick="redirectlogger()">Don't Have an Account? Sign Up Here</button>
</div>
`
}

function redirectlogger()
{
    window.location.href="/"
    logger();
}