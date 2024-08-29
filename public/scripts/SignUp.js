
function Signup() {
    const myCarousel = document.getElementById("carouselExampleAutoplaying");

    const carouselInstance = bootstrap.Carousel.getInstance(myCarousel);

    carouselInstance.pause();


    const log = document.getElementById("ln");
    log.innerHTML = `<div class="lpage"  autofocus="true" onfocus="true">
    <div class="row">
        <h3 class="sign col-11">Sign up</h3>
        <span class="close-button col-1" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </span>
    </div>
    <form action="/signup" class="form" method="post">
        <div class="row">
            <div class="col-6">
                <input type="text" class="form-control inp" name="fname" placeholder="First Name">
            </div>
            <div class="col-6">
                <input type="text" class="form-control inp" name="lname" placeholder="Last Name">
            </div>
        </div>
        
        <div class="row">
            <div class="col-8">
                <input type="email" placeholder="Email" class="form-control inp " name="mail" required>
            </div>
        </div>
        <div class="row">
            <div class="col-8">
            <select class="form-select state bg-dark inp" name="Location" aria-label="Default select example">
              <option selected>Location</option>
              <option value="Andaman and Nicobar">Andaman and Nicobar</option>
<option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chandigarh">Chandigarh</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
<option value="Daman and Diu">Daman and Diu</option>
<option value="Delhi">Delhi</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jammu and Kashmir">Jammu and Kashmir</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Ladakh">Ladakh</option>
<option value="Lakshadweep">Lakshadweep</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Puducherry">Puducherry</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>

            </select>
            </div>
        </div>
        <div class="row">
            <div class="col-8">
                <input type="password" class="form-control inp pass" name="Password" placeholder="Password" required>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="submit" class="form-control inp cr-acc" value="SignUp" required>
            </div>
        </div>
    </form>
    <div class="row">
            <div class="col">
                <a href="/auth/google" role="button" class="inp google-login">
    <img src="/images/Google__G__logo.svg.png" class="google-img" alt="Google logo">
    Register With Google
</a>
</div>
        </div>
    <button class="state al-acc" onclick="redirectSignup()">Already Have an Account? Login Here</button>
</div>
`
}

function redirectSignup() {
    window.location.href = '/';
    Signup();
}