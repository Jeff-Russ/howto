require 'test_helper'

class RailsControllerTest < ActionController::TestCase
  test "should get initial_setup" do
    get :initial_setup
    assert_response :success
  end

  test "should get generate" do
    get :generate
    assert_response :success
  end

  test "should get sendgrid" do
    get :sendgrid
    assert_response :success
  end

  test "should get bcrypt" do
    get :bcrypt
    assert_response :success
  end

  test "should get devise" do
    get :devise
    assert_response :success
  end

  test "should get stripe" do
    get :stripe
    assert_response :success
  end

  test "should get media" do
    get :media
    assert_response :success
  end

  test "should get markdown" do
    get :markdown
    assert_response :success
  end

end
